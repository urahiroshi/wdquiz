wdquiz.admin = {}
wdquiz.addInitializer ->
  wdquiz.admin.events = _.extend({}, Backbone.Events)
  console.log "router start"
  controller = new wdquiz.admin.controller()
  router = new wdquiz.admin.router(controller: controller)
  if (Backbone.history)
    console.log "start history"
    Backbone.history.start()
$ ->
  wdquiz.start()
