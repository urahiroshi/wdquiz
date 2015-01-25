###
集計画面。
コンテスト内のすべての回答、エントリー情報を取得し、総得点と時間を計算する。
###

wdquiz.question.endingView = Marionette.ItemView.extend
  template: JST["wdquiz.question.ending.jst"]
  _answers: []
  _calculatingEntries: {}
  _ascOrderedEntryIds: []
  _isFinishedEntries: false
  _isFinishedAnswers: false
  _displayingRanking: 9999
  _displayRowsOnPage: 10
  _displayBlock: [
    {
      start: 100
      end: 11
      interval: 5000
    }
    {
      start: 10
      end: 6
      interval: 5000
    }
    {
      start: 5
      end: 3
      interval: 10000
    }
    {
      start: 2
      end: 1
      interval: 5000
    }
  ]
  _finishContestOnClick: ->
    @pressKey = (keyCode) =>
      # 'f' clicked
      if keyCode == 102
        wdquiz.contestClient.finish(
          @model.toJSON().contest._id
          () ->
            console.log('コンテストを完了しました。')
          () ->
            console.log('コンテスト完了に失敗しました。')
        )
  _displayRanking: (endRanking, interval) ->
    setTimeout(
      () =>
        displayIndex = @_ascOrderedEntryIds.length - @_displayingRanking
        entryId = @_ascOrderedEntryIds[displayIndex]
        visibleEntries = @model.toJSON().visibleEntries
        if displayIndex % @_displayRowsOnPage == 0
          visibleEntries = []
        visibleEntries.unshift(@_calculatingEntries[entryId])
        @model.set(visibleEntries: visibleEntries)
        if @_displayingRanking == endRanking
          @_displayingRanking -= 1
          @_displayingRanking(endRanking, interval)
      interval
    )
  _displayRankings: (startRanking, endRanking, interval) ->
    entryCount = @_ascOrderedEntryIds.length
    if endRanking > entryCount
      @_displayingRanking = endRanking
      return false
    if startRanking > entryCount
      startRanking = entryCount
    @_displayingRanking = startRanking
    @_displayRanking(endRanking, interval)
    return true
  _displayRankingsBlock: (blockIndex) ->
    display = @_displayBlock[blockIndex]
    @_displayRankings(display.start, display.end, display.interval)
    displayFinishedChecker = setInterval(
      if @_displayingRanking == display.end
        clearInterval(displayFinishedChecker)
        @_displayRankingsBlockOnClick(blockIndex + 1)
      1000
    )
  _displayRankingsBlockOnClick: (blockIndex) ->
    @pressKey = (keyCode) =>
      # on enter clicked
      if keyCode == 13
        @pressKey = null
        if blockIndex < @_displayBlock.length
          @_displayRankingsBlock(blockIndex)
        else
          @_finishContestOnClick()
  _onGetAnswersAndEntries: () ->
    for answer in @_answers
      if answer.answerPoint > 0
        entry = @_calculatingEntries[answer._id]
        entry.totalPoint += answer.answerPoint
        entry.totalTime += answer.answerTime
    @_ascOrderedEntryIds = _.sortBy(
      _.keys(@_calculatingEntries)
      (entryId) =>
        entry = @_calculatingEntries[entryId]
        return entry.totalPoint * 10000 - entry.totalTime
    )
    @_displayRankingsBlockOnClick(0)
  _onGetEntries: (entries) ->
    for entry in entries
      @_calculatingEntries[entry._id] =
        name: entry.name
        totalPoint: 0
        totalTime: 0
    if(@_isFinishedAnswers)
      @_onGetAnswersAndEntries()
    else
      @_isFinishedEntries = true
  _onGetAnswers: (answers) ->
    @_answers = answers
    if(@_isFinishedEntries)
      @_onGetAnswersAndEntries()
    else
      @_isFinishedAnswers = true
  initialize: ->
    @listenTo @model, 'change', @render
    wdquiz.answerClient.get(
      @model.toJSON().contest._id
      (answers) =>
        @_onGetAnswers(answers)
      () ->
        console.log("error on answerClient.get")
    )
    wdquiz.entryClient.get(
      @model.toJSON().contest._id
      (entries) =>
        @_onGetEntries(entries)
      () ->
        console.log("error on entryClient.get")
    )

