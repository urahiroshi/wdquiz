###
集計画面。
コンテスト内のすべての回答、エントリー情報を取得し、総得点と時間を計算する。
###

wdquiz.question.scoreView = Marionette.ItemView.extend
  template: JST["wdquiz.question.score.jst"]
  tagName: "tr"

wdquiz.question.endingView = Marionette.CompositeView.extend
  template: JST["wdquiz.question.ending.jst"]
  childView: wdquiz.question.scoreView
  childViewContainer: "#scores"
  _answers: []
  _calculatingEntries: {}
  _ascOrderedEntryIds: []
  _audio: null
  _isFinishedEntries: false
  _isFinishedAnswers: false
  _displayedRanking: 9999
  _displayRowsOnPage: 10
  _displayBlock: [
    {
      start: 100
      end: 11
      interval: 1000
    }
    {
      start: 10
      end: 6
      interval: 1000
    }
    {
      start: 5
      end: 3
      interval: 3000
    }
    {
      start: 2
      end: 1
      interval: 3000
    }
  ]
  _finishContestOnClick: () ->
    @pressKey = (keyCode) =>
      # 'f' clicked
      if keyCode == 102
        wdquiz.contestClient.finish(
          wdquiz.question.contest._id
          () ->
            console.log('コンテストを完了しました。')
          () ->
            console.log('コンテスト完了に失敗しました。')
        )
  _displayRanking: (endRanking, interval) ->
    console.log("dispTimer: " + interval)
    setTimeout(
      () =>
        displayIndex = @_ascOrderedEntryIds.length - (@_displayedRanking - 1)
        console.log("display: " + String(displayIndex))
        entryId = @_ascOrderedEntryIds[displayIndex]
        entry = @_calculatingEntries[entryId]
        model = new wdquiz.question.scoreModel(
          ranking: @_displayedRanking - 1
          name: entry.name
          point: entry.totalPoint
          time: entry.totalTime
        )
        @collection.add model, at: 0
        # child = new wdquiz.question.scoreView(model: model)
        # @addChild(child, wdquiz.question.scoreView)
        @_displayedRanking -= 1
        if @_displayedRanking > endRanking
          @_displayRanking(endRanking, interval)
      interval
    )
  _displayRankings: (startRanking, endRanking, interval) ->
    entryCount = @_ascOrderedEntryIds.length
    if endRanking > entryCount
      @_displayedRanking = endRanking
      return false
    if startRanking > entryCount
      startRanking = entryCount
    @_displayedRanking = startRanking + 1
    @_displayRanking(endRanking, interval)
    return true
  _displayRankingsBlock: (blockIndex) ->
    console.log("block: " + String(blockIndex))
    display = @_displayBlock[blockIndex]
    if !@_displayRankings(display.start, display.end, display.interval)
      @_displayRankingsBlock(blockIndex + 1)
    else
      displayFinishedChecker = setInterval(
        () =>
          if @_displayedRanking == display.end
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
      if answer.answerPoint and answer.answerPoint > 0
        entry = @_calculatingEntries[answer.entryId]
        entry.totalPoint += answer.answerPoint
        entry.totalTime += answer.answerTime
    @_ascOrderedEntryIds = _.sortBy(
      _.keys(@_calculatingEntries)
      (entryId) =>
        entry = @_calculatingEntries[entryId]
        return entry.totalPoint * 10000000 - entry.totalTime
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
  onShow: ->
    @_audio = wdquiz.question.playAudio('audio-ending', true)
    wdquiz.answerClient.getAll(
      wdquiz.question.contest._id
      (answers) =>
        @_onGetAnswers(answers)
      () ->
        console.log("error on answerClient.get")
    )
    wdquiz.entryClient.get(
      wdquiz.question.contest._id
      (entries) =>
        @_onGetEntries(entries)
      () ->
        console.log("error on entryClient.get")
    )
