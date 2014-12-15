wdquiz = do() ->
  app = _.extend(new Marionette.Application(), Backbone.Events)
  return app