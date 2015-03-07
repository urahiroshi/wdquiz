wdquiz.question = do() ->
  wdquiz.addRegions
    containerRegion: "#container"
  
  _showContainer = (view) ->
    _prepareGoto()
    # keypressの処理をviewに委譲する
    $(document).on(
      'keypress',
      (event) ->
        if(view.pressKey)
          view.pressKey(event.keyCode)
    )
    wdquiz.containerRegion.show view
    
  _prepareGoto = ->
    $(document).off('keypress')

  question = {
    goto:
      register: ->
        model = new wdquiz.question.registerModel()
        _showContainer new wdquiz.question.registerView model: model
      quiz: (answerableQuestion) ->
        model = new wdquiz.question.quizModel
          answerableQuestion: answerableQuestion
        _showContainer new wdquiz.question.quizView model: model
      wait: () ->
        model = new wdquiz.question.waitModel()
        _showContainer new wdquiz.question.waitView model: model
      result: (answerableQuestion) ->
        model = new wdquiz.question.resultModel
          answerableQuestion: answerableQuestion
        _showContainer new wdquiz.question.resultView model: model
      ending: () ->
        collection = new wdquiz.question.endingModel()
        _showContainer new wdquiz.question.endingView collection: collection
    contest: null
  }

  # initialize on start
  wdquiz.addInitializer ->
    question.goto.register()
  $ ->
    wdquiz.start()
  
  return question
