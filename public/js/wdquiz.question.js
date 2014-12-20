wdquiz.question = (function() {
  var question, _prepareGoto, _showContainer;
  wdquiz.addRegions({
    containerRegion: "#container"
  });
  _showContainer = function(view) {
    _prepareGoto();
    $(document).on('keypress', function(event) {
      if (view.pressKey) {
        return view.pressKey(event.keyCode);
      }
    });
    return wdquiz.containerRegion.show(view);
  };
  _prepareGoto = function() {
    return $(document).off('keypress');
  };
  question = {
    goto: {
      register: function() {
        return _showContainer(new wdquiz.question.registerView());
      },
      quiz: function(contest, answerableQuestion) {
        var model;
        model = new wdquiz.question.quizModel({
          contest: contest,
          answerableQuestion: answerableQuestion
        });
        return _showContainer(new wdquiz.question.quizView({
          model: model
        }));
      },
      wait: function(contest) {
        var model;
        model = new wdquiz.question.waitModel({
          contest: contest
        });
        return _showContainer(new wdquiz.question.waitView({
          model: model
        }));
      },
      result: function(contest) {
        var model;
        model = new wdquiz.question.resultModel({
          contest: contest
        });
        return _showContainer(new wdquiz.question.resultView({
          model: model
        }));
      }
    }
  };
  wdquiz.addInitializer(function() {
    return question.goto.register();
  });
  $(function() {
    return wdquiz.start();
  });
  return question;
})();

wdquiz.question.quizModel = Backbone.Model.extend({
  defaults: {
    contest: {},
    answerableQuestion: {},
    _timer: ''
  }
});

wdquiz.question.waitModel = Backbone.Model.extend({
  defaults: {
    contest: {}
  }
});

wdquiz.question.resultModel = Backbone.Model.extend({
  defaults: {
    contest: {}
  }
});

wdquiz.question.baseView = Backbone.Marionette.LayoutView.extend({
  template: JST["wdquiz.question.base.jst"]
});

wdquiz.question.choicesView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.choices.jst"]
});

wdquiz.question.questionView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.question.jst"]
});


/*
設問画面。
一定時間が経過すると、設問終了の命令を送信して次の画面に遷移する(間にキー入力入れる？)
 */
wdquiz.question.quizView = Backbone.Marionette.ItemView.extend({
  template: JST["wdquiz.question.quiz.jst"],
  _timer: 0,
  initialize: function() {
    return this.listenTo(this.model, 'change', this.render);
  },
  _onDeleteQuestion: function(result) {
    return wdquiz.question.goto.wait(this.model.get('contest'));
  },
  _countDown: function() {
    this._timer = this._timer - 1;
    this.model.set({
      _timer: String(this._timer)
    });
    if (this._timer > 0) {
      return window.setTimeout(_.bind(this._countDown, this), 1000);
    } else {
      return wdquiz.answerableQuestionClient["delete"](this.model.get('answerableQuestion')._id, _.bind(this._onDeleteQuestion, this), function() {
        return console.log('error: answerableQuestionClient.delete');
      });
    }
  },
  onShow: function() {
    this._timer = this.model.get('answerableQuestion').question.timeout + 1;
    return this._countDown();
  }
});


/*
最初の画面。
開催中のコンテストがあれば、ボタン押下により次の画面に遷移する。
開催中のコンテストが無ければコンテストを作成し、ボタン押下により待機画面に遷移する。
コンテストが作成されればユーザーの登録が受け付けられ、登録済みのユーザー名が表示される。
 */
wdquiz.question.registerView = Backbone.Marionette.ItemView.extend({
  template: JST["wdquiz.question.register.jst"],
  _enableKeyPress: false,
  _contest: {},
  _onSuccessGetNotFinished: function(result) {
    if (result._id) {
      console.log('find contest');
      this._contest = result;
      return this._enableKeyPress = true;
    } else {
      return wdquiz.contestClient.create(function(result) {
        console.log('create contest');
        this._contest = result;
        return this._enableKeyPress = true;
      }, function() {
        return console.log('error: contestClient.create');
      });
    }
  },
  pressKey: function(keyCode) {
    if (this._enableKeyPress) {
      return wdquiz.question.goto.wait(this._contest);
    }
  },
  onShow: function() {
    return wdquiz.contestClient.getNotFinished(_.bind(this._onSuccessGetNotFinished, this), function() {
      return console.log('error: contestClient.getNotFinished');
    });
  }
});


/*
結果発表画面。
 */
wdquiz.question.resultView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.result.jst"]
});


/*
設問画面に行く前の待機画面。
キー入力により設問要求が行われ、設問画面に遷移する。
すべての設問が終了した場合(createで空が返ってくる)、結果発表画面に遷移する。
 */
wdquiz.question.waitView = Marionette.ItemView.extend({
  template: JST["wdquiz.question.wait.jst"],
  _contest: {},
  initialize: function() {
    return this._contest = this.model.toJSON().contest;
  },
  _onSuccessCreateAnswerableQuestion: function(result) {
    var answerableQuestion;
    if (result._id) {
      answerableQuestion = result;
      return wdquiz.question.goto.quiz(this._contest, answerableQuestion);
    } else {
      return wdquiz.question.goto.result(this._contest);
    }
  },
  pressKey: function(keyCode) {
    return wdquiz.answerableQuestionClient.create(this._contest._id, _.bind(this._onSuccessCreateAnswerableQuestion, this), function() {
      return console.log('error: answerableQuestionClient.create');
    });
  }
});
