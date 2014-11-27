wdquiz.question = new Marionette.Application()
wdquiz.question.addRegions
  containerRegion: "#container"

# initialize
wdquiz.question.addInitializer ->
  wdquiz.question.containerRegion.show new wdquiz.question.containerView()

$ ->
  wdquiz.question.start()
