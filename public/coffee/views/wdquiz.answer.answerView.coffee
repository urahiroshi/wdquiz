###
回答画面。
###

wdquiz.answer.answerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.answer.jst"]
  events:
    "click .btnChoice": "onClickChoice"
  _answerableQuestionId: ''
  _contest: null
  _answerFinishedChecker: null
  _sendChoice: (number) ->
    clearInterval(@_answerFinishedChecker)
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
  createAnswerFinishedChecker: ->
    @_answerFinishedChecker = setInterval(
      () =>
        wdquiz.answerableQuestionClient.check(
          @_answerableQuestionId
          (answerableQuestion) =>
            if (answerableQuestion.isFinished)
              clearInterval(@_answerFinishedChecker)
              console.log "question finished !!"
              wdquiz.answer.goto.waitQuiz(@_contest)
          () ->
            console.log "error: answerableQuestion.get"
        )
      2000
    )
  onClickChoice: (event) ->
    id = $(event.target).attr('id')
    number = id.split('_')[1]
    @_sendChoice(number)
  initialize: ->
    @_contest = @model.toJSON().contest
    @createAnswerFinishedChecker()
    @_answerableQuestionId = @model.toJSON().answerableQuestion._id

