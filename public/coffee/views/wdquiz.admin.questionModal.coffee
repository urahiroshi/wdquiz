wdquiz.admin.questionModal = Marionette.ItemView.extend
  template: JST["wdquiz.admin.question.modal.jst"]
  triggers:
    "click #addChoice": "add:choice"
    "click #deleteChoice": "delete:choice"
    "click #saveQuestion": "save:question"
  onShow: ->
    console.log 'viewModal'
    $('#closeQuestion').on 'click', ->
      wdquiz.admin.events.trigger('close:modal')
    @on 'add:choice', ->
      console.log "add choice"
    @on 'delete:choice', ->
      console.log "delete choice"
    @on 'save:question', ->
      console.log "save question"
      
