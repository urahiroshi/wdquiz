wdquiz.module(
  'apiClient'
  (module, app, Backbone, Marionette, $, _) ->
    _ajax = (type) ->
      return (url, data, onSuccess, onError) ->
        $.ajax(
          url: url
          type: type
          data: data
        ) .done (result)->
            if(onSuccess)
              onSuccess(result)
          .fail ->
            if(onError)
              onError()
    _.extend this, {
      post: _ajax 'POST'
      get: _ajax 'GET'
      put: _ajax 'PUT'
      delete: _ajax 'DELETE'
    }
)

wdquiz.module(
  'questionClient'
  (module, app, Backbone, Marionette, $, _, base) ->
    url = wdquiz.config.api.questionUrl
    _.extend this, {
      create: (record, onSuccess, onError) ->
        base.post url, record, onSuccess, onError
      getAll: (onSuccess, onError) ->
        base.get url, {}, onSuccess, onError
      update: (id, updateMap, onSuccess, onError) ->
        base.put url + id, updateMap, onSuccess, onError
      delete: (id, onSuccess, onError) ->
        base.delete url + id, {}, onSuccess, onError
    }
  wdquiz.apiClient
)
  
wdquiz.module(
  'answerableQuestionClient'
  (module, app, Backbone, Marionette, $, _, base) ->
    url = wdquiz.config.api.answerableQuestionUrl
    _.extend this, {
      create: (contestId, onSuccess, onError) ->
        base.post url, {contestId: contestId}, onSuccess, onError
      delete: (id, onSuccess, onError) ->
        base.delete url + id, {}, onSuccess, onError
    }
  wdquiz.apiClient
)

wdquiz.module(
  'contestClient'
  (module, app, Backbone, Marionette, $, _, base) ->
    url = wdquiz.config.api.contestUrl
    _.extend this, {
      getNotFinished: (onSuccess, onError) ->
        base.get url, {}, onSuccess, onError
      create: (onSuccess, onError) ->
        base.post url, {}, onSuccess, onError
      finish: (id, onSuccess, onError) ->
        base.delete url + id, {}, onSuccess, onError
    }
  wdquiz.apiClient
)