wdquiz.admin.router = Marionette.AppRouter.extend(
  appRoutes:
    "*question": "showQuestion"
    ".*": "showQuestion"
)

wdquiz.admin.controller = Marionette.Controller.extend(
  showQuestion: ->
    console.log "showQuestion called"
    wdquiz.addRegions
      contentsRegion: "#contents"
    model = new wdquiz.admin.questionModel()
    wdquiz.contentsRegion.show new wdquiz.admin.questionView(model: model)
)