'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answer';

model.create = function(entryId, answerableQuestionId, answer, callback) {
  return client.create(
    TABLE_NAME,
    {
      entryId: entryId,
      answerableQuestionId: answerableQuestionId,
      answer: answer,
      answerDt: dt.now()
    },
    callback
  );
};

module.exports = model;
