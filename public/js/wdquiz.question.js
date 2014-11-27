wdquiz.question = new Marionette.Application();

wdquiz.question.addRegions({
  containerRegion: "#container"
});

wdquiz.question.addInitializer(function() {
  return wdquiz.question.containerRegion.show(new wdquiz.question.containerView());
});

$(function() {
  return wdquiz.question.start();
});

wdquiz.question.choicesView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.choices.jst"]
});

wdquiz.question.containerView = Backbone.Marionette.LayoutView.extend({
  template: JST["wdquiz.question.container.jst"],
  regions: {
    question: "#question",
    choices: "#choices"
  },
  onShow: function() {
    this.question.show(new wdquiz.question.questionView());
    return this.choices.show(new wdquiz.question.choicesView());
  }
});

wdquiz.question.questionView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.question.jst"]
});
