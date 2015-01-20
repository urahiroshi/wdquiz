wdquiz.answer = do() ->
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

  answer = {
    setId: (id) ->
      wdquiz.common.setCookie('id', id, 1)
    getId: () ->
      return wdquiz.common.getCookie('id')
    goto:
      entry: (contest) ->
        model = new wdquiz.answer.entryModel
          contest: contest
        _showContainer new wdquiz.question.entryView model: model
      waitContest: () ->
        model = new wdquiz.answer.waitContestModel
          message: 'クイズが開始するまで待機しています。'
        _showContainer new wdquiz.answer.waitContestView model: model
      waitQuiz: (contest) ->
        model = new wdquiz.answer.waitQuizModel
          message: '次の問題までお待ちください・・・'
          contest: contest
        _showContainer new wdquiz.answer.waitQuizView model: model
      waitResult: (contest, question) ->
        model = new wdquiz.answer.waitResultModel
          message: '回答を送信しました。'
          contest: contest
          question: question
        _showContainer new wdquiz.answer.waitResultView model: model
      answer: (contest, question) ->
        model = new wdquiz.answer.answerModel
          contest: contest
          question: question
        _showContainer new wdquiz.answer.answerView model: model
  }

  # initialize on start
  wdquiz.addInitializer ->
    answer.goto.waitContest()
  $ ->
    wdquiz.start()

  return answer
