'use strict';

var client = require('./dbClient'),
    Q = require('q'),
    model = {},
    TABLE_NAME = 'question',
    sortChoices,
    isValidChoices;

sortChoices = function(record) {
  if (record.choices) {
    record.choices.sort(function (choice1, choice2) {
      return (Number(choice1.number) > Number(choice2.number) ? 1 : -1);
    });
  }
};

isValidChoices = function(record) {
  if (record.choices) {
    for(var i = 0, len = record.choices.length; i < len ; i++) {
      if (record.choices.every(function(choice) {
            return (Number(choice.number) !== i + 1);
          }))
      {
        return false;
      }
    }
  }
  return true;
};

model.create = function(record) {
  if(isValidChoices(record)) {
    sortChoices(record);
    return client.create(TABLE_NAME, record);
  } else {
    return Q.reject("選択肢の番号が不正です");
  }
};

model.getOne = function(id) {
  return client.read(
    TABLE_NAME,
    {
      _id: id
    }
  );
};

model.getAll = function() {
  return client.read(
    TABLE_NAME,
    {
      $query: {},
      $orderby: { order: 1 }
    }
  );
};

model.getValid = function(questions) {
  var validQuestionIds = questions
    .filter(function(question) {
      return (question.order > 0);
    })
    .map(function(question) {
      return question.id;
    });
  return validQuestionIds;
};

model.getByOrder = function(order) {
  return client.readOne(
    TABLE_NAME,
    {
      order: order
    }
  );
};

model.getNext = function(beforeOrder) {
  return client.readOne(
    TABLE_NAME,
    {
      $query: { order: { $gt: beforeOrder }},
      $orderby: { order: 1 }
    }
  );
};

model.update = function(id, updateMap) {
  if (isValidChoices(updateMap)) {
    sortChoices(updateMap);
    return client.update(
        TABLE_NAME,
        {
          _id: id
        },
        updateMap
    );
  } else {
    return Q.reject("選択肢の番号が不正です");
  }
};

model.delete = function(id) {
  return client.delete(
    TABLE_NAME,
    {
      _id: id
    }
  );
};

module.exports = model;
