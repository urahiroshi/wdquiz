###
設問画面に行く前の待機画面。
設問情報を取得して問題番号を表示し、キー入力により設問画面に遷移する。
すべての設問が終了した場合(createで空が返ってくる)、結果発表画面に遷移する。
###

wdquiz.question.waitView = Marionette.ItemView.extend
  template: JST["wdquiz.question.wait.jst"]
  _contest: {}
  _onSuccessCreateAnswerableQuestion: (answerableQuestion) ->
    if answerableQuestion._id
      @model.set(title: answerableQuestion.question.order + '問目')
      @pressKey = (keyCode) =>

        wdquiz.question.goto.quiz(@_contest, answerableQuestion)
    else
      wdquiz.question.goto.ending()
  initialize: ->
    @_contest = @model.toJSON().contest
    wdquiz.answerableQuestionClient.create(
      @_contest._id
      (result) =>
        @_onSuccessCreateAnswerableQuestion(result)
      () ->
        console.log 'error: answerableQuestionClient.create'
    )


