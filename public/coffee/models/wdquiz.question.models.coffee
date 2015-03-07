wdquiz.question.registerModel = Backbone.Model.extend
  defaults:
    entries: []

wdquiz.question.quizModel = Backbone.Model.extend
  defaults: 
    answerableQuestion: {}
    answerCount: []
    _timer: ''
    
wdquiz.question.waitModel = Backbone.Model.extend
  defaults: 
    title: ''

wdquiz.question.resultModel = Backbone.Model.extend
  defaults:
    answerableQuestion: {}
    validEntries: []

wdquiz.question.scoreModel = Backbone.Model.extend
  defaults:
    name: ''
    point: 0
    time: 0

wdquiz.question.endingModel = Backbone.Collection.extend
  model: wdquiz.question.scoreModel
