wdquiz.question.containerView = Backbone.Marionette.LayoutView.extend(
  template: JST["wdquiz.question.container.jst"]
  regions:
    question: "#question"
    choices: "#choices"
  onShow: ->
    @question.show new wdquiz.question.questionView()
    @choices.show new wdquiz.question.choicesView()
)
