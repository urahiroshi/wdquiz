###
最初の画面。
開催中のコンテストがあれば、すぐに次の画面に遷移する。
開催中のコンテストが無ければコンテストを作成し、ボタン押下により待機画面に遷移する。
コンテストが作成されればユーザーの登録が受け付けられ、登録済みのユーザー名が表示される。
###

wdquiz.question.registerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.question.register.jst"]
  _onSuccessGetNotFinished: (result) ->
    if(result._id)
      console.log 'find contest'
      wdquiz.question.contest = result
      wdquiz.question.goto.wait()
    else
      wdquiz.contestClient.create(
        (result) =>
          console.log 'create contest'
          wdquiz.question.contest = result
          @pressKey = (keyCode) ->
            wdquiz.question.goto.wait()
        () ->
          console.log 'error: contestClient.create'
      )
  onShow: ->
    wdquiz.contestClient.getNotFinished(
      _.bind @_onSuccessGetNotFinished, @
      () ->
        console.log 'error: contestClient.getNotFinished'
    )
