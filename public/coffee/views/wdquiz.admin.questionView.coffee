wdquiz.admin.questionView = Marionette.LayoutView.extend
  template: JST["wdquiz.admin.question.jst"]
  regions:
    modal: "#modal"
  initialize: ->
    @listenTo @model, 'change', @render
  ui:
    modalOverlay: ".modal-overlay"
    addButton: ".btnAdd"
    editButtons: ".btnEdit"
    deleteButtons: ".btnDelete"
  _onClickAdd: ->
    console.log 'onClickAdd'
    @_viewModal {}
  _onClickEdit: (id) ->
    console.log 'onClickEdit: ' + id
    questions = _.filter @model.get('questions'), (question) ->
      return question._id == id
    @_viewModal questions[0]
  _onClickDelete: (id) ->
    console.log 'onClickDelete: ' + id
  _viewModal: (question) ->
    model = new wdquiz.admin.questionModalModel(question: question)
    @getRegion('modal').show new wdquiz.admin.questionModal(model: model)
    $(@ui.modalOverlay).toggle()
  _hideModal: ->
    $(@ui.modalOverlay).toggle()
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
    @listenTo(wdquiz.admin.events, 'close:modal', @_hideModal)
    wdquiz.questionClient.getAll(
      _.bind(
        (result) ->
          @model.set(questions: result)
        @
      )
      () ->
        console.log 'error: questionClient.getAll'
    )
