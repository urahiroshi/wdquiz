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
  _onClickEdit: (id) ->
    console.log 'onClickEdit: ' + id
  _onClickDelete: (id) ->
    console.log 'onClickDelete: ' + id
  onRender: ->
    if (@ui.addButton)
      $(@ui.addButton).on 'click', ->
        wdquiz.admin.events.trigger('click:add')
    if (@ui.deleteButtons)
      @ui.deleteButtons.each ->
        id = $(this).parent().attr('id')
        $(this).on 'click', ->
          wdquiz.admin.events.trigger('click:delete', id)
    if (@ui.editButtons)
      @ui.editButtons.each ->
        id = $(this).parent().attr('id')
        $(this).on 'click', ->
          wdquiz.admin.events.trigger('click:edit', id)
  onShow: ->
    @listenTo(wdquiz.admin.events, 'click:add', @_onClickAdd)
    @listenTo(wdquiz.admin.events, 'click:edit', @_onClickEdit)
    @listenTo(wdquiz.admin.events, 'click:delete', @_onClickDelete)
    wdquiz.questionClient.getAll(
      _.bind(
        (result) ->
          @model.set(question: result)
        @
      )
      () ->
        console.log 'error: questionClient.getAll'
    )
