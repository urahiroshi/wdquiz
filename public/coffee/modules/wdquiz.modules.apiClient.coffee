wdquiz.module(
  'apiClient'
  (module, app, Backbone, Marionette, $, _) ->
    _ajax = (type, option) ->
      return (url, data, onSuccess, onError) ->
        option = option || {}
        option.url = url
        option.type = type
        if (option.dataType == 'json')
          option.data = JSON.stringify data
        else
          option.data = data
        $.ajax(option)
          .done (result)->
            onSuccess(result) if onSuccess
          .fail ->
            onError() if onError
    _json = (type) ->
      return _ajax type, {dataType: 'json', contentType: 'application/json'}
    _.extend this, {
      post: _json 'POST'
      get: _ajax 'GET'
      put: _json 'PUT'
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
      get: (contestId, onSuccess, onError) ->
        base.get url, {contestId: contestId}, onSuccess, onError
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
      result: (id, onSuccess, onError) ->
        base.get url + id + '/result', {}, onSuccess, onError
    }
  wdquiz.apiClient
)

wdquiz.module(
  'entryClient'
  (module, app, Backbone, Marionette, $, _, base) ->
    url = wdquiz.config.api.entryUrl
    _.extend this, {
      create: (contestId, name, onSuccess, onError) ->
        base.post url, {contestId: contestId, name: name}, onSuccess, onError
      get: (contestId, onSuccess, onError) ->
        base.get url, {contestId: contestId}, onSuccess, onError
      getOne: (contestId, id, onSuccess, onError) ->
        base.get url, {contestId: contestId, id: id}, onSuccess, onError
    }
  wdquiz.apiClient
)

wdquiz.module(
  'answerClient'
  (module, app, Backbone, Marionette, $, _, base) ->
    url = wdquiz.config.api.answerUrl
    _.extend this, {
      create: (answerableQuestionId, entryId, number, onSuccess, onError) ->
        param = {
          answerableQuestionId: answerableQuestionId
          entryId: entryId
          number: number
        }
        base.post url, param, onSuccess, onError
      get: (answerableQuestionId, onSuccess, onError) ->
        param = {
          answerableQuestionId: answerableQuestionId
        }
        base.get url, param, onSuccess, onError
      getOne: (answerableQuestionId, entryId, onSuccess, onError) ->
        param = {
          answerableQuestionId: answerableQuestionId
          entryId: entryId
        }
        base.get url, param, onSuccess, onError
    }
  wdquiz.apiClient
)
