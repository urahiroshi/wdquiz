wdquiz.question.quizView = Backbone.Marionette.LayoutView.extend(
  template: JST["wdquiz.question.quiz.jst"]
  regions:
    question: "#question"
    choices: "#choices"
  onShow: ->
    @question.show new wdquiz.question.questionView()
    @choices.show new wdquiz.question.choicesView()
)
