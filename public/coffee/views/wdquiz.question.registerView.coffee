###
最初の画面。
開催中のコンテストがあれば、ボタン押下により次の画面に遷移する。
開催中のコンテストが無ければコンテストを作成し、ボタン押下により待機画面に遷移する。
コンテストが作成されればユーザーの登録が受け付けられ、登録済みのユーザー名が表示される。
###

wdquiz.question.registerView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.question.register.jst"]
  _enableKeyPress: false
  _viewEntriesInterval: null
  _audio: null
  _onSuccessGetNotFinished: (result) ->
    if(result._id)
      console.log 'find contest'
      wdquiz.question.contest = result
      @_setViewEntriesInterval(result._id)
      @_enableKeyPress = true
    else
      wdquiz.contestClient.create(
        (result) =>
          console.log 'create contest'
          wdquiz.question.contest = result
          @_setViewEntriesInterval(result._id)
          @_enableKeyPress = true
        () ->
          console.log 'error: contestClient.create'
      )
  _setViewEntriesInterval: (contestId) ->
    @_viewEntriesInterval = setInterval(
      () =>
        @_viewEntries(contestId)
      500
    )
  _viewEntries: (contestId) ->
    wdquiz.entryClient.get(
      contestId
      (result) =>
        @model.set(entries: result)
      () ->
        console.log 'error: entryClient.get'
    )
  pressKey: (keyCode) ->
    if(@_enableKeyPress)
      clearInterval(@_viewEntriesInterval)
      @_audio.pause()
      wdquiz.question.goto.wait()
  initialize: ->
    @listenTo @model, 'change', @render
    @_audio = wdquiz.question.playAudio('audio-opening', true)
    wdquiz.contestClient.getNotFinished(
      _.bind @_onSuccessGetNotFinished, @
      () ->
        console.log 'error: contestClient.getNotFinished'
    )
