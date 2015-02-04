wdquiz.question.quizModel = Backbone.Model.extend
  defaults: 
    contest: {}
    answerableQuestion: {}
    _timer: ''
    
wdquiz.question.waitModel = Backbone.Model.extend
  defaults: 
    contest: {}
    title: ''

wdquiz.question.resultModel = Backbone.Model.extend
  defaults:
    contest: {}
    answerableQuestion: {}
    validEntries: []

wdquiz.question.scoreModel = Backbone.Model.extend
  defaults:
    name: ''
    point: 0
    time: 0

wdquiz.question.endingModel = Backbone.Collection.extend
  model: wdquiz.question.scoreModel
