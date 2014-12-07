'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'contest';

model.create = function() {
  return client.create(
    TABLE_NAME,
    {
      finishedOrder: 0,
      isFinished: false,
      startDt: dt.now()
    }
  );
};

model.readOne = function(id) {
  return client.readOne(
    TABLE_NAME,
    {
      _id: id
    }
  );
};

model.finishOrder = function(id, order) {
  return client.update(
    TABLE_NAME,
    {
      _id: id,
      finishedOrder: order
    }
  );
};

model.finish = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isFinished: true,
      endDt: dt.now()
    }
  );
};

module.exports = model;
