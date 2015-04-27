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

wdquiz.question.rankingModel = Backbone.Model.extend
  defaults:
    ranking: 0
    name: ''
    time: 0

wdquiz.question.resultModel = Backbone.Collection.extend
  model: wdquiz.question.rankingModel

wdquiz.question.scoreModel = Backbone.Model.extend
  defaults:
    name: ''
    point: 0
    time: 0

wdquiz.question.endingModel = Backbone.Collection.extend
  model: wdquiz.question.scoreModel
