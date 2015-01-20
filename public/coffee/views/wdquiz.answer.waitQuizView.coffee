wdquiz.answer.waitQuizView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _waitQuizStarted: (onStartQuiz) ->
    contest = @model.toJSON().contest
    wdquiz.answerableQuestionClient.get(
      contest._id
      (result) =>
        if (result._id)
          onStartQuiz(contest, result)
        else
          setTimeout(@_waitQuizStarted, 500)
      setTimeout(@_waitQuizStarted, 500)
    )
  onShow: ->
    @_waitQuizStarted(wdquiz.answer.goto.answer)

