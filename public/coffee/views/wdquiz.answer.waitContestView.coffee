###
コンテスト開始待ち画面。
開催中のコンテストが見つかれば、現在のID値を取得してエントリー済みか確認する。
未エントリーであればエントリー画面へ、
エントリー済みであればクイズ待ち画面へ遷移する。
###

wdquiz.answer.waitContestView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _retryAfterWait: () ->
    setTimeout(
      () =>
        @_waitContestStarted()
      500
    )

  _gotoNext: (entryId, contest, count) ->
    wdquiz.entryClient.getOne(
      entryId
      contest._id
      (entry) =>
        if entry._id
          wdquiz.answer.goto.waitQuiz(contest)
        else
          wdquiz.answer.goto.entry(contest)
      () =>
        console.log('error: entryClient.getOne')
        if count < 3
          @_gotoNext(entryId, contest, count + 1)
        else
          wdquiz.answer.goto.entry(contest)
    )
          
  _onContestStarted: (contest) ->
    entryId = wdquiz.answer.getId()
    if entryId
      @_gotoNext(entryId, contest, 0)
    else
      wdquiz.answer.goto.entry(contest)
      
  _waitContestStarted: () ->
    wdquiz.contestClient.getNotFinished(
      (contest) =>
        if contest._id
          @_onContestStarted(contest)
        else
          @_retryAfterWait()
      () =>
        @_retryAfterWait()
    )

  onShow: ->
    @_waitContestStarted()

