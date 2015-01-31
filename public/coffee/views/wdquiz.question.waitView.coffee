###
設問画面に行く前の待機画面。
キー入力により設問要求が行われ、設問画面に遷移する。
すべての設問が終了した場合(createで空が返ってくる)、結果発表画面に遷移する。
###

wdquiz.question.waitView = Marionette.ItemView.extend
  template: JST["wdquiz.question.wait.jst"]
  _contest: {}
  initialize: ->
    @_contest = @model.toJSON().contest
  _onSuccessCreateAnswerableQuestion: (result) ->
    if(result._id)
      answerableQuestion = result
      wdquiz.question.goto.quiz(@_contest, answerableQuestion)
    else
      wdquiz.question.goto.ending()
  pressKey: (keyCode) ->
    wdquiz.answerableQuestionClient.create(
      @_contest._id
      _.bind @_onSuccessCreateAnswerableQuestion, @
      () ->
        console.log 'error: answerableQuestionClient.create'
    )
