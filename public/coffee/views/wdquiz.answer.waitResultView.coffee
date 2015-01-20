wdquiz.answer.waitResultView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _answerableQuestionId: ''
  _entryId: ''
  _gotoNext: () ->
    # TODO: 次のページに必要な情報を渡す
    wdquiz.answer.goto.waitQuiz(@model.toJSON().contest)
  _waitGetResult: () ->
    wdquiz.answerClient.get(
      @_answerableQuestionId
      @_entryId
      (result) =>
        if (result.isCorrect != undefined)
          if (result.isCorrect)
            text = '正解しました！'
          else
            text = '残念、不正解です。'
          @model.set(message: text)
          setTimeout(@_gotoNext, 5000)
        else
          setTimeout(@_waitContestStarted, 500)
      setTimeout(@_waitContestStarted, 500)
    )
  onShow: ->
    _waitGetResult()
  initialize: ->
    @_answerableQuestionId = @model.toJSON().question._id
    @_entryId = wdquiz.answer.getid()
    @listenTo @model, 'change', @render

