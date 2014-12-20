var wdquiz;

wdquiz = (function() {
  var app;
  app = _.extend(new Marionette.Application(), Backbone.Events);
  return app;
})();

wdquiz.config = (function() {
  var baseUrl;
  baseUrl = '/api/';
  return {
    api: {
      answerableQuestionUrl: "" + baseUrl + "answerableQuestion/",
      answerUrl: "" + baseUrl + "answer/",
      contestUrl: "" + baseUrl + "contest/",
      entryUrl: "" + baseUrl + "entry/",
      questionUrl: "" + baseUrl + "question/"
    }
  };
})();

wdquiz.module('apiClient', function(module, app, Backbone, Marionette, $, _) {
  var _ajax;
  _ajax = function(type) {
    return function(url, data, onSuccess, onError) {
      return $.ajax({
        url: url,
        type: type,
        data: data
      }).done(function(result) {
        if (onSuccess) {
          return onSuccess(result);
        }
      }).fail(function() {
        if (onError) {
          return onError();
        }
      });
    };
  };
  return _.extend(this, {
    post: _ajax('POST'),
    get: _ajax('GET'),
    put: _ajax('PUT'),
    "delete": _ajax('DELETE')
  });
});

wdquiz.module('questionClient', function(module, app, Backbone, Marionette, $, _, base) {
  var url;
  url = wdquiz.config.api.questionUrl;
  return _.extend(this, {
    create: function(record, onSuccess, onError) {
      return base.post(url, record, onSuccess, onError);
    },
    getAll: function(onSuccess, onError) {
      return base.get(url, {}, onSuccess, onError);
    },
    update: function(id, updateMap, onSuccess, onError) {
      return base.put(url + id, updateMap, onSuccess, onError);
    },
    "delete": function(id, onSuccess, onError) {
      return base["delete"](url + id, {}, onSuccess, onError);
    }
  });
}, wdquiz.apiClient);

wdquiz.module('answerableQuestionClient', function(module, app, Backbone, Marionette, $, _, base) {
  var url;
  url = wdquiz.config.api.answerableQuestionUrl;
  return _.extend(this, {
    create: function(contestId, onSuccess, onError) {
      return base.post(url, {
        contestId: contestId
      }, onSuccess, onError);
    },
    "delete": function(id, onSuccess, onError) {
      return base["delete"](url + id, {}, onSuccess, onError);
    }
  });
}, wdquiz.apiClient);

wdquiz.module('contestClient', function(module, app, Backbone, Marionette, $, _, base) {
  var url;
  url = wdquiz.config.api.contestUrl;
  return _.extend(this, {
    getNotFinished: function(onSuccess, onError) {
      return base.get(url, {}, onSuccess, onError);
    },
    create: function(onSuccess, onError) {
      return base.post(url, {}, onSuccess, onError);
    },
    finish: function(id, onSuccess, onError) {
      return base["delete"](url + id, {}, onSuccess, onError);
    }
  });
}, wdquiz.apiClient);
