'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answerableQuestion';

model.getOne = function(id) {
  return client.readOne(
    TABLE_NAME,
    {
      _id: id
    }
  );
};

model.getEnabledQuestions = function() {
  return client.read(
    TABLE_NAME,
    {
      isEnabled: true
    }
  );
  return (enableQuestions.length > 0);
};

model.create = function(contestId, questionId) {
  var onGetEnabledQuestions;
  onGetEnabledQuestions = function(enabledQuestions) {
    if(enabledQuestions.length > 0) {
      return client.create(
        TABLE_NAME,
        {
          questionId: questionId,
          contestId: contestId,
          startDt: dt.now(),
          isEnabled: true
        }
      );
    } else {
      return {};
    }
  };
  return model.getEnabledQuestions()
    .then(onGetEnabledQuestions);
};

model.finish = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isEnabled: false,
      endDt: dt.now()
    }
  );
};

module.exports = model;
