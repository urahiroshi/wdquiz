'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'entry';

// 同じnameが指定されれば作成せず、空を返す
model.create = function(name, contestId) {
  var getOne, create;
  getOne = function() {
    return client.read(
      TABLE_NAME,
      {
        name: name,
        contestId: contestId
      }
    );
  };
  create = function(sameName) {
    if (sameName.length === 0) {
      return client.create(
        TABLE_NAME,
        {
          name: name,
          contestId: contestId,
          createDt: dt.now()
        }
      );
    } else {
      return {};
    }
  };
  return getOne()
    .then(create);
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

model.getOne = function(id, contestId) {
  return client.readOne(
    TABLE_NAME,
    {
      _id: id,
      contestId: contestId
    }
  );
};


module.exports = model;
