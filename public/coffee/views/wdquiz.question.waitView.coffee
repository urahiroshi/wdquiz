###
設問画面に行く前の待機画面。
設問情報を取得して問題番号を表示し、キー入力により設問画面に遷移する。
すべての設問が終了した場合(createで空が返ってくる)、結果発表画面に遷移する。

各タイミングで画面をリロードした場合、以下のように動く。
  1. 設問開始前～設問開始後～設問タイムアウトまで(finishedじゃない設問情報がある)
  現在の設問情報と回答を破棄し、設問開始前の最初からやり直し。(サーバ側でやっている)
  2. 設問タイムアウト後～次画面遷移まで(finishedな設問情報しかない)
  現在の回答は保持し、すぐに結果発表の状態になる。
###

wdquiz.question.waitView = Marionette.ItemView.extend
  template: JST["wdquiz.question.wait.jst"]
  _onSuccessCreateAnswerableQuestion: (answerableQuestion) ->
    if answerableQuestion._id
      @model.set(title: answerableQuestion.question.order + '問目')
      wdquiz.question.playAudio('audio-quiz-prepare')
      @pressKey = (keyCode) =>
        wdquiz.answerableQuestionClient.changeVisible(
          answerableQuestion._id
          true
          () =>
            wdquiz.question.goto.quiz(answerableQuestion)
          () ->
            console.log 'error: answerableQuestionClient.enable'
        )
    else
      wdquiz.question.goto.ending()

  _onSuccessGetAnswerableQuestion: (answerableQuestion) ->
    if answerableQuestion.isVisible && answerableQuestion.isFinished
      answerableQuestion.question.timeout = 0
      wdquiz.question.goto.quiz(answerableQuestion)
    else
      wdquiz.answerableQuestionClient.create(
        wdquiz.question.contest._id
        (result) =>
          @_onSuccessCreateAnswerableQuestion(result)
        () ->
          console.log 'error: answerableQuestionClient.create'
      )

  initialize: ->
    @listenTo @model, 'change', @render
    wdquiz.answerableQuestionClient.get(
      wdquiz.question.contest._id
      (result) =>
        @_onSuccessGetAnswerableQuestion(result)
      () ->
        console.log 'error: answerableQuestion.get'
    )
