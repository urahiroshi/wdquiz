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

model.getId = function(name) {
  return client.read(
    TABLE_NAME,
    {
      name: name
    }
  ).then(function(entry) {
    return entry.id;
  });
};


module.exports = model;
