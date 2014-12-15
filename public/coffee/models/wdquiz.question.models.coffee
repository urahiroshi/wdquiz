wdquiz.question.quizModel = Backbone.Model.extend
  defaults: 
    contest: {}
    answerableQuestion: {}
    _timer: ''
    
wdquiz.question.waitModel = Backbone.Model.extend
  defaults: 
    contest: {}

wdquiz.question.resultModel = Backbone.Model.extend
  defaults: 
    contest: {}
