wdquiz.answer.entryModel = Backbone.Model.extend
  defaults:
    contest: {}

wdquiz.answer.answerModel = Backbone.Model.extend
  defaults:
    contest: {}
    question: {}

wdquiz.answer.waitContestModel = Backbone.Model.extend
  defaults:
    message: ""

wdquiz.answer.waitQuizModel = Backbone.Model.extend
  defaults:
    message: ""
    contest: {}

wdquiz.answer.waitResultModel = Backbone.Model.extend
  defaults:
    message: ""
    contest: {}
    question: {}