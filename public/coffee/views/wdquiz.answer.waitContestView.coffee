wdquiz.answer.waitContestView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _waitContestStarted: (onStartContest) ->
    wdquiz.contestClient.getNotFinished(
      (result) =>
        if (result._id)
          onStartContest(result)
        else
          setTimeout(@_waitContestStarted, 500)
      setTimeout(@_waitContestStarted, 500)
    )
  onShow: ->
    @_waitContestStarted(wdquiz.answer.goto.entry)

