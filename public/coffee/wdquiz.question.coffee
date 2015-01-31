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
        _showContainer new wdquiz.question.registerView()
      quiz: (contest, answerableQuestion) ->
        model = new wdquiz.question.quizModel
          contest: contest
          answerableQuestion: answerableQuestion
        _showContainer new wdquiz.question.quizView model: model
      wait: (contest) ->
        model = new wdquiz.question.waitModel
          contest: contest
        _showContainer new wdquiz.question.waitView model: model
      result: (contest, answerableQuestion) ->
        model = new wdquiz.question.resultModel
          contest: contest
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
