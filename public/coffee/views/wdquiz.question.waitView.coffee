###
設問画面に行く前の待機画面。
設問情報を取得して問題番号を表示し、キー入力により設問画面に遷移する。
すべての設問が終了した場合(createで空が返ってくる)、結果発表画面に遷移する。
TODO: 再度この画面が呼び出されたら、新しいanswerableQuestionを作って、既存のデータは破棄する
###

wdquiz.question.waitView = Marionette.ItemView.extend
  template: JST["wdquiz.question.wait.jst"]
  _onSuccessCreateAnswerableQuestion: (answerableQuestion) ->
    if answerableQuestion._id
      @model.set(title: answerableQuestion.question.order + '問目')
      @pressKey = (keyCode) =>
        wdquiz.answerableQuestionClient.enable(
          answerableQuestion._id
          () =>
            wdquiz.question.goto.quiz(answerableQuestion)
          () ->
            console.log 'error: answerableQuestionClient.enable'
        )
    else
      wdquiz.question.goto.ending()
  initialize: ->
    @listenTo @model, 'change', @render
    wdquiz.answerableQuestionClient.create(
      wdquiz.question.contest._id
      (result) =>
        @_onSuccessCreateAnswerableQuestion(result)
      () ->
        console.log 'error: answerableQuestionClient.create'
    )


