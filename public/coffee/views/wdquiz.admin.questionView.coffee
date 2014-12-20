wdquiz.admin.questionView = Marionette.ItemView.extend
  template: JST["wdquiz.admin.question.jst"]
  initialize: ->
    @listenTo @model, 'change', @render
  ui:
    modal: "#modal"
    addButon: ".btnAdd"
    editButtons: ".btnEdit"
    deleteButtons: ".btnDelete"
  _onClickAdd: ->
    console.log 'onClickAdd'
  _onClickEdit: (event) ->
    id = event.target.parent().attr('id')
    console.log 'onClickEdit: ' + id
  _onClickDelete: (event) ->
    id = event.target.parent().attr('id')
    console.log 'onClickDelete: ' + id
  onRender: ->
    addButon.on(
      'click'
      _.bind(@_onClickAdd, @)
    )
    removeButtons.on(
      'click'
      _.bind(@_onClickRemove, @)
    )
    editButtons.on(
      'click'
      _.bind(@_onClickEdit, @)
    )
  onShow: ->
    wdquiz.questionClient.getAll(
      (result) ->
        @model.set(question: result)
      () ->
        console.log 'error: questionClient.getAll'
    )
