wdquiz.question = do() ->
  app = _.extend(new Marionette.Application(), Backbone.Events)
  app.addRegions
    containerRegion: "#container"

  _showContainer = (view, links) ->
    _prepareGoto()
    for link in links
      app.listenTo(view, link, goto[link])
    $(document).on(
      'keypress',
      (event) ->
        if(view.pressKey)
          view.pressKey(event.keyCode)
    )
    app.containerRegion.show view
    
  _prepareGoto = ->
    app.stopListening()
    $(document).off('keypress')

  _goto =
    register: -> 
      _showContainer(new wdquiz.question.registerView(), ['wait'])
    quiz: ->
      _showContainer(new wdquiz.question.quizView(), ['wait', 'timing', 'result'])
    wait: ->
      _showContainer(new wdquiz.question.waitView(), ['quiz'])
    timing: ->
      _showContainer(new wdquiz.question.timingView(), ['quiz', 'result'])
      wdquiz.question.containerRegion.show new wdquiz.question.timingView()
    result: ->
      _showContainer(new wdquiz.question.resultView(), [])

  # initialize on start
  app.addInitializer ->
    _goto.register()

  $ ->
    app.start()
  
  return app
