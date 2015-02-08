###
途中経過発表画面 => 中間発表にするか、一問ごとの早押し結果にするか要検討。
###

wdquiz.question.resultView = Marionette.ItemView.extend
  template: JST["wdquiz.question.result.jst"]
  _answers: null
  _entries: null
  _onGetAnswersAndEntries: () ->

  _onGetEntries: (entries) ->
    @_entries = entries
    if(@_answers)
      @_onGetAnswersAndEntries()
  _onGetAnswers: (answers) ->
    @_answers = answers
    if(@_entries)
      @_onGetAnswersAndEntries()
  initialize: ->
    @listenTo @model, 'change', @render
    wdquiz.answerClient.get(
      @model.toJSON().answerableQuestion._id
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

