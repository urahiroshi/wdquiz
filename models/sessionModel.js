'use strict';

var client = require('./dbClient'),
    model = {},
    TABLE_NAME = 'session',
    dt = require('./dtHandler'),
    Q = require('q'),
    uuid = require('node-uuid');

model.PERMISSION = {
  QUESTION: 'question',
  ADMIN: 'admin'
};

model.SESSIONID = 'sessionId';

model._createSession = function(permission) {
  var startDt = dt.now(),
      endDt = dt.getDate(startDt, 1),
      sessionId = uuid.v4(),
      onGetSession;
  onGetSession = function(session) {
    if (session._id) {
      return model._createSession(permission);
    } else {
      return client.create(
        TABLE_NAME,
        {
          sessionId: sessionId,
          permission: permission,
          startDt: startDt,
          endDt: endDt
        }
      );
    }
  };
  return model._getSession(sessionId)
    .then(onGetSession);
};

model.createQuestionSession = function() {
  return this._createSession(model.PERMISSION.QUESTION);
};

model._getSession = function(sessionId) {
  return client.readOne(
    TABLE_NAME,
    {
      sessionId: sessionId
    }
  );
};

model.hasPermission = function(cookies, permission) {
  var sessionKey = permission + '.' + model.SESSIONID,
      checkSession;
  checkSession = function(session) {
    if (session.permission === permission) {
      return true;
    } else {
      return false;
    }
  };
  if (cookies[sessionKey]) {
    return model._getSession(cookies[sessionKey])
      .then(checkSession);
  } else {
    return Q(false);
  }
};

module.exports = model;
