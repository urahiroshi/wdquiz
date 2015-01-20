wdquiz.answer.answerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.answer.jst"]
  events:
    "click .btnChoice": "onClickChoice"
  _answerableQuestionId: ''
  _sendChoice: (number) ->
    return () =>
      wdquiz.answerClient.create(
        @_answerableQuestionId
        number
        (result) =>
          wdquiz.answer.goto.waitResult(
            @model.toJSON().contest
            @model.toJSON().question
          )
        () =>
          setTimeout(@_sendChoice(number), 100)
      )
  onClickChoice: (event) ->
    id = $(event.target).attr('id')
    number = id.split('_')[1]
    @_sendChoice(number)()
  initialize: ->
    @_answerableQuestionId = @model.toJSON().question._id

