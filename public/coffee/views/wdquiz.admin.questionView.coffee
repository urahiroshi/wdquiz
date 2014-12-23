wdquiz.admin.questionView = wdquiz.admin.LayoutView.extend
  # ---- properties ----
  template: JST["wdquiz.admin.question.jst"]
  regions:
    modal: "#modal"
  ui:
    modalOverlay: ".modal-overlay"
    editButtons: ".btnEdit"
    deleteButtons: ".btnDelete"
  events:
    "click .btnAdd": "onClickAdd"
    "click .btnEdit": "onClickEdit"
    "click .btnDelete": "onClickDelete"
  # ---- private methods ----
  _viewModal: (question) ->
    model = new wdquiz.admin.questionModalModel(question: question)
    @getRegion('modal').show new wdquiz.admin.questionModal(model: model)
    $(@ui.modalOverlay).toggle()
  _refreshView: ->
    wdquiz.questionClient.getAll(
      (result) =>
        @model.set(questions: result)
      @_genMsgHandler 'error: questionClient.getAll'
    )
  # ---- event handlers ----
  onClickAdd: ->
    console.log 'onClickAdd'
    @_viewModal {}
  onClickEdit: (event) ->
    id = $(event.target).parent().attr('id')
    console.log 'onClickEdit: ' + id
    questions = _.filter @model.get('questions'), (question) ->
      return question._id == id
    @_viewModal questions[0]
  onClickDelete: (event) ->
    if (window.confirm '本当に削除してよろしいですか？')
      id = $(event.target).parent().attr('id')
      console.log 'onClickDelete: ' + id
      wdquiz.questionClient.delete(
        id
        () =>
          @_genMsgHandler('削除しました。')()
          @_refreshView()
        @_genMsgHandler '削除に失敗しました。'
      )
  hideModal: ->
    console.log 'close modal'
    @_refreshView()
    $(@ui.modalOverlay).toggle()
  # ---- override methods ----
  initialize: ->
    @listenTo @model, 'change', @render
  onShow: ->
    @listenTo(wdquiz.admin.events, 'close:modal', @hideModal)
    @_refreshView()
