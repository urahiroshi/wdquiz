wdquiz.answer.waitResultView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.wait.jst"]
  _answerableQuestionId: ''
  _entryId: ''
  _waitNextQuiz: (message) ->
    wdquiz.answer.goto.waitQuiz(@model.toJSON().contest, message)
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
          @_waitNextQuiz(@model.toJSON().message)
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

