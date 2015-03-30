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

  _onPressKey: (callback, targetKey) ->
    targetKey = targetKey || 13
    @pressKey = (keyCode) =>
      if keyCode == targetKey
        callback()

  _gotoNext: ->
    wdquiz.question.goto.wait @model.get('contest')

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
    effect = @EFFECT.LENS_BLUR
    for image in $(@ui.choiceImages)
      canvas = fx.canvas()
      texture = canvas.texture(image)
      @_draw(canvas, texture, effect, 100)
      image.parentNode.insertBefore(canvas, image)
      image.parentNode.removeChild(image)
      @_effectees.push(canvas: canvas, texture: texture)
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
      @_draw(effectee.canvas, effectee.texture, effect, level)

  _draw: (canvas, texture, effect, level) ->
    if effect == @EFFECT.LENS_BLUR
      canvas.draw(texture).lensBlur(level / 2, 0.75, 0).update()

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
