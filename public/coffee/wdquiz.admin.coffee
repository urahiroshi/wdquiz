wdquiz.admin = {}
wdquiz.addInitializer ->
  console.log "router start"
  controller = new wdquiz.admin.controller()
  router = new wdquiz.admin.router(controller: controller)
  if (Backbone.history)
    console.log "start history"
    Backbone.history.start()
$ ->
  wdquiz.start()
