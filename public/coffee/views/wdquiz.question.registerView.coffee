wdquiz.question.registerView = Backbone.Marionette.ItemView.extend(
  template: JST["wdquiz.question.register.jst"]
  pressKey: (keyCode) ->
    @gotoWait()
  gotoWait: ->
    console.log 'gotowait called'
    @trigger 'wait'
)
