###
設問画面。
一定時間が経過すると、設問終了の命令を送信して次の画面に遷移する(間にキー入力入れる？)
###

wdquiz.question.quizView = Backbone.Marionette.ItemView.extend
  template: JST["wdquiz.question.quiz.jst"]
  _timer: 0
  initialize: ->
    @listenTo @model, 'change', @render
  _onDeleteQuestion: (result) ->
    # TODO: result画面に移るケースも追加。
    wdquiz.question.goto.wait @model.get('contest')
  _countDown: ->
    @_timer = @_timer - 1
    @model.set(_timer: String(@_timer))
    if(@_timer > 0)
      window.setTimeout _.bind(@_countDown, @), 1000
    else
      wdquiz.answerableQuestionClient.delete(
        @model.get('answerableQuestion')._id
        _.bind(@_onDeleteQuestion, @)
        () ->
          console.log 'error: answerableQuestionClient.delete'
      )
  onShow: ->
    @_timer = @model.get('answerableQuestion').question.timeout + 1
    @_countDown()
