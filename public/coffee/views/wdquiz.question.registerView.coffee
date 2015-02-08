###
最初の画面。
開催中のコンテストがあれば、ボタン押下により次の画面に遷移する。
開催中のコンテストが無ければコンテストを作成し、ボタン押下により待機画面に遷移する。
コンテストが作成されればユーザーの登録が受け付けられ、登録済みのユーザー名が表示される。
###

wdquiz.question.registerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.question.register.jst"]
  _enableKeyPress: false
  _onSuccessGetNotFinished: (result) ->
    if(result._id)
      console.log 'find contest'
      wdquiz.question.contest = result
      @_enableKeyPress = true
    else
      wdquiz.contestClient.create(
        (result) =>
          console.log 'create contest'
          wdquiz.question.contest = result
          @_enableKeyPress = true
        () ->
          console.log 'error: contestClient.create'
      )
  pressKey: (keyCode) ->
    if(@_enableKeyPress)
      wdquiz.question.goto.wait()
  onShow: ->
    wdquiz.contestClient.getNotFinished(
      _.bind @_onSuccessGetNotFinished, @
      () ->
        console.log 'error: contestClient.getNotFinished'
    )
