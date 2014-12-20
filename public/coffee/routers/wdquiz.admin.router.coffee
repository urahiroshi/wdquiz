wdquiz.admin.router do() ->
  router = Backbone.Router.extend(
    wdquiz.addRegions
      contentsRegion: "#contents"
    routes:
      "question": "showQuestion"
      "*": "showQuestion"
    showQuestion: ->
      wdquiz.contentsRegion.show new wdquiz.admin.questionView()
  )
  return router
