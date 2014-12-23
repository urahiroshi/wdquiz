'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answer';

model.create = function(entryId, answerableQuestionId, answerNumber) {
  return client.create(
    TABLE_NAME,
    {
      entryId: entryId,
      answerableQuestionId: answerableQuestionId,
      answerNumber: answerNumber,
      answerDt: dt.now()
    }
  );
};

model.get = function(answerableQuestionId) {
  return client.read(
    TABLE_NAME,
    {
      $query: {answerableQuestionId: answerableQuestionId},
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

module.exports = model;
