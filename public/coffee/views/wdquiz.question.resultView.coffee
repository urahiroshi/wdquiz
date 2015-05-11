###
途中経過発表画面 => 中間発表にするか、一問ごとの早押し結果にするか要検討。
###

wdquiz.question.timeView = Marionette.ItemView.extend
  template: JST["wdquiz.question.time.jst"]
  tagName: "tr"

wdquiz.question.resultView = Marionette.CompositeView.extend
  template: JST["wdquiz.question.result.jst"]
  childView: wdquiz.question.timeView
  childViewContainer: "#times"
  _answers: null
  _entries: null
  _orderedAnswers: null
  _DISPLAY_INTERVAL: 500
  answerableQuestion: null
  _audio: null

  _displayRanking: (index) ->
    if index >= 0
      setTimeout(
        () =>
          model = new wdquiz.question.rankingModel(
            ranking: index + 1
            entryName: @_orderedAnswers[index].entryName
            answerTime: @_orderedAnswers[index].answerTime
          )
          @collection.add model, at: 0
          @_displayRanking(index - 1)
        @_DISPLAY_INTERVAL
      )
    else
      @pressKey = (keyCode) =>
        if keyCode == 13
          @_audio.pause()
          @pressKey = null
          wdquiz.question.goto.wait()

  _onGetAnswersAndEntries: () ->
    @_orderedAnswers = _.map(
      _.sortBy(
        @_answers
        (answer) =>
          answer.answerTime
      )
      (orderedAnswer, index) =>
        entryName: @_entries[orderedAnswer.entryId]
        answerTime: orderedAnswer.answerTime
    )
    @_displayRanking(@_orderedAnswers.length - 1)

  _onGetEntries: (entries) ->
    entriesObj = {}
    _.each(
      entries
      (entry) =>
        entriesObj[entry._id] = entry.name
    )
    @_entries = entriesObj
    if(@_answers)
      @_onGetAnswersAndEntries()

  _onGetAnswers: (answers) ->
    @_answers = _.filter(
      answers
      (answer) =>
        answer.answerPoint > 0
    )
    if(@_entries)
      @_onGetAnswersAndEntries()

  onShow: ->
    @_audio = wdquiz.question.playAudio('audio-result', true)
    wdquiz.answerClient.get(
      @answerableQuestion._id
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

