###
設問画面。
一定時間が経過すると、キー入力により以下のように遷移する
1. 各設問の選択者数を表示する
2. 回答を表示する
3. 設問終了の命令を送信して次の画面に遷移する
###

wdquiz.question.quizView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.question.quiz.jst"]
  _timer: 0
  _timeout: 0
  _imgX: 360
  _imgY: 360
  _answerableQuestion: null
  ui:
    choiceImages: ".choice-image"
    timer: "#timer"
    choiceContents: ".choice-content"
    choiceAnswers: ".choice-answers"
  _effectees: []
  _audio: null
  EFFECT:
    LENS_BLUR: 0
    ZOOM_BLUR: 1
    ZOOM_OUT: 2
    HEXAGONAL: 3
    NONE: -1

  _onPressKey: (callback, targetKey) ->
    targetKey = targetKey || 13
    @pressKey = (keyCode) =>
      if keyCode == targetKey
        callback()

  _gotoNext: ->
    answerCount = @model.get('answerCount')
    correctCount = answerCount[@_answerableQuestion.question.correctNumber]
    if correctCount == 0
      wdquiz.question.goto.wait()
    else
      wdquiz.question.goto.result(@_answerableQuestion)

  _viewCorrectAnswer: ->
    wdquiz.question.playAudio('audio-correct-answer')
    # 正解を表示する
    correctNumber = @_answerableQuestion.question.correctNumber
    $answerContainer = $("#answer_" + correctNumber)
    $answerContainer.css("background-color", "yellow")
    console.log("gotoNext by keypress")
    @_onPressKey(
      () =>
        wdquiz.answerableQuestionClient.changeVisible(
          @_answerableQuestion._id
          false
          () =>
            @_gotoNext()
          () ->
            console.log 'answerableQuestionの無効化に失敗しました。'
        )
    )

  _startEffect: () ->
    effect = @_answerableQuestion.question.effect
    for image in $(@ui.choiceImages)
      effectee = canvas: null, context: null, texture: null
      if effect == @EFFECT.ZOOM_OUT
        effectee.canvas = document.createElement('canvas')
        effectee.canvas.width = @_imgX
        effectee.canvas.height = @_imgY
        effectee.context = effectee.canvas.getContext('2d')
        effectee.image = new Image()
        effectee.image.src = image.src
      else if effect != @EFFECT.NONE
        effectee.canvas = fx.canvas()
        effectee.texture = effectee.canvas.texture(image)
      @_draw(effectee, effect, 100)
      image.parentNode.insertBefore(effectee.canvas, image)
      image.parentNode.removeChild(image)
      @_effectees.push(effectee)
    $(@ui.choiceContents).css('visibility', 'visible')
    @_setEffectTimer(effect, @_timeout * 1000, 250, 1)

  _setEffectTimer: (effect, totalTime, interval, counter) ->
    elapsedTime = counter * interval
    level = (1 - (elapsedTime / totalTime)) * 100
    setTimeout(
      () =>
        if elapsedTime < totalTime
          @_setEffectTimer(effect, totalTime, interval, counter + 1)
        @_applyEffect(effect, level)
      interval
    )

  _applyEffect: (effect, level) ->
    for effectee in @_effectees
      @_draw(effectee, effect, level)

  _draw: (effectee, effect, level) ->
    # levelは100(強エフェクト)から0(エフェクトなし)まで選択できる
    if effect == @EFFECT.LENS_BLUR
      effectee.canvas.draw(effectee.texture).lensBlur(
        level / 2
        0.75
        0
      ).update()
    else if effect == @EFFECT.ZOOM_BLUR
      effectee.canvas.draw(effectee.texture).zoomBlur(
        @_imgX / 2
        @_imgY / 2
        level / 100
      ).update()
    else if effect == @EFFECT.HEXAGONAL
      if level == 0
        effectee.canvas.draw(effectee.texture).lensBlur(0, 0.75, 0).update()
      else
        effectee.canvas.draw(effectee.texture).hexagonalPixelate(
          @_imgX / 2
          @_imgY / 2
          level / 2
        ).update()
    else if effect == @EFFECT.ZOOM_OUT
      iw = effectee.image.width
      ih = effectee.image.height
      sw = Math.floor(iw  / (1 + level / 20))
      sh = Math.floor(ih  / (1 + level / 20))
      effectee.context.drawImage(
        effectee.image
        (iw - sw) / 2
        (ih - sh) / 2
        (iw + sw) / 2
        (ih + sh) / 2
        0
        0
        @_imgX
        @_imgY
      )

  _viewAnswerCount: ->
    # 各番号の回答数を表示する
    wdquiz.answerClient.get(
      @_answerableQuestion._id
      (answers) =>
        choiceLength = @_answerableQuestion.question.choices.length
        answerCount = (0 for dummy in [0..choiceLength])
        for answer in answers
          answerCount[answer.answerNumber] += 1
        @model.set(answerCount: answerCount)
        $(@ui.choiceAnswers).css('background-color', 'white')
        wdquiz.question.playAudio('audio-answer-count')
        console.log("viewCorrectAnswer by keypress")
        @_onPressKey(() => @_viewCorrectAnswer())
      () =>
        console.log("error: answerClient.get")
        @_viewAnswerCount()
    )

  _finishQuestion: () ->
    @_endAudio()
    wdquiz.answerableQuestionClient.delete(
      @_answerableQuestion._id
      (result) =>
        console.log("viewAnswerCount by keypress")
        @_onPressKey(() => @_viewAnswerCount())
      () ->
        console.log("error: answerableQuestionClient.delete")
    )

  _setTimer: (time) ->
    $(@ui.timer).text(String(time))

  _countDown: ->
    @_timer = @_timer - 1
    @_setTimer(@_timer)
    if(@_timer > 0)
      window.setTimeout(
        () => @_countDown()
        1000
      )
    else
      @_finishQuestion()

  _startAudio: ->
    audio = wdquiz.question.playAudio('audio-quiz-start')
    audio.onended = () =>
      @_audio = wdquiz.question.playAudio('audio-quiz-tick', true)

  _endAudio: ->
    if @_audio
      @_audio.pause()
    wdquiz.question.playAudio('audio-quiz-end')

  initialize: ->
    @listenTo @model, 'change', @render
    @_answerableQuestion = @model.get('answerableQuestion')

  onShow: ->
    @_timeout = @_answerableQuestion.question.timeout
    @_setTimer(@_timeout)
    if @_timeout > 0
      $(@ui.choiceContents).css('visibility', 'hidden')
      @_timer = @_timeout + 1
      window.setTimeout(
        () =>
          @_startEffect()
          @_startAudio()
          @_countDown()
        300
      )
    else
      @_finishQuestion()
