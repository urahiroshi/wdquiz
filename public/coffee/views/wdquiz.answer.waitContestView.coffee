wdquiz.answer.waitContestView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _retryAfterWait: () ->
    setTimeout(
      () =>
        @_waitContestStarted()
      500
    )
  _waitContestStarted: () ->
    wdquiz.contestClient.getNotFinished(
      (result) =>
        if (result._id)
          wdquiz.answer.goto.entry(result)
        else
          @_retryAfterWait()
      () =>
        @_retryAfterWait()
    )
  onShow: ->
    @_waitContestStarted()

