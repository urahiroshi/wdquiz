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

model.get = function(query) {
  return client.read(
    TABLE_NAME,
    {
      $query: query,
      $orderby: { answerDt: 1 }
    }
  );
};

model.getOne = function(answerableQuestionId, entryId) {
  return client.readOne(
    TABLE_NAME,
    {
      answerableQuestionId: answerableQuestionId,
      entryId: entryId
    }
  );
};

model.update = function(id, isCorrest) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isCorrect: isCorrect
    }
  );
};

module.exports = model;
