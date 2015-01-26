###
回答画面。
###

wdquiz.answer.answerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.answer.jst"]
  events:
    "click .btnChoice": "onClickChoice"
  _answerableQuestionId: ''
  _sendChoice: (number) ->
    wdquiz.answerClient.create(
      @_answerableQuestionId
      wdquiz.answer.getId()
      number
      (result) =>
        wdquiz.answer.goto.waitResult(
          @model.toJSON().contest
          @model.toJSON().answerableQuestion
        )
      () =>
        setTimeout(
          () =>
            @_sendChoice(number)
          100
        )
    )
  onClickChoice: (event) ->
    id = $(event.target).attr('id')
    number = id.split('_')[1]
    @_sendChoice(number)
  initialize: ->
    @_answerableQuestionId = @model.toJSON().answerableQuestion._id

