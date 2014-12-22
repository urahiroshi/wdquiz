wdquiz.admin.questionModal = Marionette.ItemView.extend
  template: JST["wdquiz.admin.question.modal.jst"]
  events:
    "click #addChoice": "_addChoice"
    "click #deleteChoice": "_deleteChoice"
    "click #saveQuestion": "_saveQuestion"
    "click #closeQuestion": "_closeQuestion"
  _addChoice: ->
    console.log "add choice"
  _deleteChoice: ->
    console.log "delete choice"
  _saveQuestion: ->
    console.log "save question"
  _closeQuestion: ->
    wdquiz.admin.events.trigger('close:modal')
  onShow: ->
    console.log 'viewModal'
