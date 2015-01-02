'use strict';

var client = require('./dbClient'),
    model = {},
    TABLE_NAME = 'entry';

model.create = function(name, contestId) {
  return client.create(
    TABLE_NAME,
    {
      name: name,
      contestId: contestId,
      createDt: dt.now()
    }
  );
};

model.get = function(contestId) {
  return client.read(
    TABLE_NAME,
    {
      $query: {contestId: contestId},
      $orderby: { createDt: 1 }
    }
  );
};

model.getOne = function(name) {
  return client.readOne(
    TABLE_NAME,
    {
      name: name
    }
  );
};


module.exports = model;
