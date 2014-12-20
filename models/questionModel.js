'use strict';

var client = require('./dbClient'),
    model = {},
    TABLE_NAME = 'question';

model.create = function(record) {
  return client.create(TABLE_NAME, record);
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
    .filter(function(q) {
      return (q.order > 0);
    })
    .map(function(q) {
      return q.id;
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
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    updateMap
  );
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
