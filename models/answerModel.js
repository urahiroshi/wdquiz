'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answer';

model.create = function(entryId, answerableQuestionId, answerNumber, contestId, startDt) {
  return client.create(
    TABLE_NAME,
    {
      entryId: entryId,
      answerableQuestionId: answerableQuestionId,
      answerNumber: answerNumber,
      contestId: contestId,
      answerTime: dt.now() - startDt
    }
  );
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

model.update = function(id, answerPoint) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      answerPoint: answerPoint
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
