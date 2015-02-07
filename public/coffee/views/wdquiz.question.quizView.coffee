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
  _answerableQuestion: null

  _onPressKey: (callback, targetKey) ->
    targetKey = targetKey || 13
    @pressKey = (keyCode) =>
      if keyCode == targetKey
        callback()

  _finishQuestion: ->
    wdquiz.answerableQuestionClient.delete(
      @_answerableQuestion._id
      (result) =>
        # TODO: result画面に移るケースも追加。
        wdquiz.question.goto.wait @model.get('contest')
      () ->
        console.log 'error: answerableQuestionClient.delete'
    )

  _viewCorrectAnswer: ->
    # 正解を表示する
    correctNumber = @_answerableQuestion.question.correctNumber
    $answerContainer = $("#answer_" + correctNumber)
    $answerContainer.css("background-color", "yellow")
    console.log("finishQuestion by keypress")
    @_onPressKey(() => @_finishQuestion())

  _viewAnswerCount: ->
    # 各番号の回答数を表示する
    wdquiz.answerClient.get(
      @_answerableQuestion._id
      (answers) =>
        answerCount = _.map(@_answerableQuestion.question.choices, () -> 0)
        for answer in answers
          answerCount[answer.answerNumber] += 1
        @model.set(answerCount: answerCount)
        console.log("viewCorrectAnswer by keypress")
        @_onPressKey(() => @_viewCorrectAnswer())
      () =>
        console.log("error: answerClient.get")
        @_viewAnswerCount()
    )

  _countDown: ->
    @_timer = @_timer - 1
    @model.set(_timer: String(@_timer))
    if(@_timer > 0)
      window.setTimeout(
        () => @_countDown()
        1000
      )
    else
      console.log("viewAnswerCount by keypress")
      @_onPressKey(() => @_viewAnswerCount())

  initialize: ->
    @listenTo @model, 'change', @render
    @_answerableQuestion = @model.get('answerableQuestion')

  onShow: ->
    @_timer = @_answerableQuestion.question.timeout + 1
    @_countDown()
