wdquiz.admin.questionView = Marionette.LayoutView.extend
  template: JST["wdquiz.admin.question.jst"]
  regions:
    modal: "#modal"
  initialize: ->
    @listenTo @model, 'change', @render
  ui:
    modalOverlay: ".modal-overlay"
    editButtons: ".btnEdit"
    deleteButtons: ".btnDelete"
  events:
    "click .btnAdd": "_onClickAdd"
    "click .btnEdit": "_onClickEdit"
    "click .btnDelete": "_onClickDelete"
  _onClickAdd: ->
    console.log 'onClickAdd'
    @_viewModal {}
  _onClickEdit: (event) ->
    id = $(event.target).parent().attr('id')
    console.log 'onClickEdit: ' + id
    questions = _.filter @model.get('questions'), (question) ->
      return question._id == id
    @_viewModal questions[0]
  _onClickDelete: (event) ->
    id = $(event.target).parent().attr('id')
    console.log 'onClickDelete: ' + id
  _viewModal: (question) ->
    model = new wdquiz.admin.questionModalModel(question: question)
    @getRegion('modal').show new wdquiz.admin.questionModal(model: model)
    $(@ui.modalOverlay).toggle()
  _hideModal: ->
    console.log 'close modal'
    $(@ui.modalOverlay).toggle()
  onShow: ->
    @listenTo(wdquiz.admin.events, 'close:modal', @_hideModal)
    wdquiz.questionClient.getAll(
      (result) =>
        @model.set(questions: result)
      () ->
        console.log 'error: questionClient.getAll'
    )
