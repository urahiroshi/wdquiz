wdquiz.answer.waitQuizView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _retryAfterWait: () ->
    setTimeout(
      () =>
        @_waitQuizStarted()
      500
    )
  _waitQuizStarted: () ->
    contest = @model.toJSON().contest
    wdquiz.answerableQuestionClient.get(
      contest._id
      (result) =>
        if (result._id)
          console.log("goto quiz: " + result._id)
          wdquiz.answer.goto.answer(contest, result)
        else
          @_retryAfterWait()
      () =>
        console.log("error: answerableQuestion.get")
        @_retryAfterWait()
    )
  onShow: ->
    @_waitQuizStarted()

