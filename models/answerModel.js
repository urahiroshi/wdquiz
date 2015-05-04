'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answer';

model.create = function(entryId, answerableQuestionId, answerNumber, answerDt, contestId, startDt) {
  var onGetAnswer;
  onGetAnswer = function(answer) {
    if (answer._id) {
      return {};
    } else {
      return client.create(
        TABLE_NAME,
        {
          entryId: entryId,
          answerableQuestionId: answerableQuestionId,
          answerNumber: answerNumber,
          contestId: contestId,
          answerDt: answerDt
        }
      );
    }
  };
  return model.getOne(answerableQuestionId, entryId)
    .then(onGetAnswer);
};

model._get = function(query) {
  return client.read(
    TABLE_NAME,
    {
      $query: query,
      $orderby: { answerTime: 1 }
    }
  );
};

model.getAll = function(contestId) {
  return model._get({contestId: contestId});
}

model.get = function(answerableQuestionId) {
  return model._get({answerableQuestionId: answerableQuestionId});
}

model.getOne = function(answerableQuestionId, entryId) {
  return client.readOne(
    TABLE_NAME,
    {
      answerableQuestionId: answerableQuestionId,
      entryId: entryId
    }
  );
};

model.update = function(id, answerPoint, answerTime) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      answerPoint: answerPoint,
      answerTime: answerTime
    }
  );
};

model.delete = function(answerableQuestionId) {
  return client.delete(
    TABLE_NAME,
    {
      answerableQuestionId: answerableQuestionId
    }
  );
};

module.exports = model;
