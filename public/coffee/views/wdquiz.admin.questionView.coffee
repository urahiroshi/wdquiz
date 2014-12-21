wdquiz.admin.questionView = Marionette.ItemView.extend
  template: JST["wdquiz.admin.question.jst"]
  initialize: ->
    @listenTo @model, 'change', @render
  ui:
    modal: "#modal"
    addButton: ".btnAdd"
    editButtons: ".btnEdit"
    deleteButtons: ".btnDelete"
  _onClickAdd: ->
    console.log 'onClickAdd'
  _onClickEdit: (event) ->
    id = $(event.target).parent().attr('id')
    console.log 'onClickEdit: ' + id
  _onClickDelete: (event) ->
    id = $(event.target).parent().attr('id')
    console.log 'onClickDelete: ' + id
  _addOnClickDelete: (index, elem) ->
    $(elem).on(
      'click'
      _.bind(@_onClickDelete, @)
    )
  _addOnClickEdit: (index, elem) ->
    $(elem).on(
      'click'
      _.bind(@_onClickEdit, @)
    )
  onRender: ->
    if (@ui.addButton)
      $(@ui.addButton).on(
        'click'
        _.bind(@_onClickAdd, @)
      )
    if (@ui.deleteButtons)
      $.each(
        @ui.deleteButtons
        _.bind(@_addOnClickDelete, @)
      )
    if (@ui.editButtons)
      $.each(
        @ui.editButtons
        _.bind(@_addOnClickEdit, @)
      )
  onShow: ->
    wdquiz.questionClient.getAll(
      _.bind(
        (result) ->
          @model.set(question: result)
        @
      )
      () ->
        console.log 'error: questionClient.getAll'
    )
