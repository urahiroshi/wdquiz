###
  エントリー画面。wdquiz.answerで最初の画面。
  エントリー名称を入力すれば、問題待機画面に遷移する。
  エントリー名称入力済みであれば、すぐに問題待機画面に遷移する。
###

wdquiz.answer.entryView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.answer.entry.jst"]
  events:
    "click #sendEntryName": "sendEntryName"
  sendEntryName: ->
    entryName = $("#entryName").val()
    contest = @model.toJSON().contest
    wdquiz.entryClient.create(
      contest._id
      entryName
      (result) =>
        if (result._id)
          wdquiz.answer.setId(result._id)
          wdquiz.answer.goto.waitQuiz(contest)
        else
          alert('その名前は既に使用されています。違う名前を入力してください。')
      ->
        console.log('エントリーの作成に失敗しました。(処理失敗)')
    )
