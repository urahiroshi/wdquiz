wdquiz.question = new Marionette.Application();

wdquiz.question.addRegions({
  containerRegion: "#container"
});

wdquiz.question.addInitializer(function() {
  return wdquiz.question.containerRegion.show(new wdquiz.question.container());
});

$(function() {
  return wdquiz.question.start();
});



wdquiz.question.choices = Marionette.ItemView.extend({
  template: JST["wdquiz.question.choices.jst"]
});

wdquiz.question.container = Backbone.Marionette.LayoutView.extend({
  template: JST["wdquiz.question.container.jst"],
  regions: {
    question: "#question",
    choices: "#choices"
  },
  onShow: function() {
    this.question.show(new wdquiz.question.question());
    return this.choices.show(new wdquiz.question.choices());
  }
});

wdquiz.question.question = Marionette.ItemView.extend({
  template: JST["wdquiz.question.question.jst"]
});
