'use strict';

var client = require('./dbClient'),
    model = {},
    TABLE_NAME = 'entry';

model.create = function(record, callback) {
  return client.create(TABLE_NAME, record, callback);
};

module.exports = model;
