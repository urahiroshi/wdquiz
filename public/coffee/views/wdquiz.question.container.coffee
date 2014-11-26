wdquiz.question.container = Backbone.Marionette.LayoutView.extend(
  template: JST["wdquiz.question.container.jst"]
  regions:
    question: "#question"
    choices: "#choices"
  onShow: ->
    @question.show new wdquiz.question.question()
    @choices.show new wdquiz.question.choices()
)
