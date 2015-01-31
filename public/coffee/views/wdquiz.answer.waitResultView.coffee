wdquiz.answer.waitResultView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _answerableQuestionId: ''
  _entryId: ''
  _gotoNext: () ->
    wdquiz.answer.goto.waitQuiz(@model.toJSON().contest)
  _retryAfterWait: () ->
    setTimeout(
      () =>
        @_waitGetResult()
      500
    )
  _waitGetResult: () ->
    wdquiz.answerClient.getOne(
      @_answerableQuestionId
      @_entryId
      (result) =>
        if (result.answerPoint != undefined)
          if (result.answerPoint > 0)
            text = '正解しました！'
          else
            text = '残念、不正解です。'
          @model.set(message: text)
          setTimeout(
            () =>
              @_gotoNext()
            5000
          )
        else
          @_retryAfterWait()
      () =>
        @_retryAfterWait()
    )
  onShow: ->
    @_waitGetResult()
  initialize: ->
    @_answerableQuestionId = @model.toJSON().answerableQuestion._id
    @_entryId = wdquiz.answer.getId()
    @listenTo @model, 'change', @render

