'use strict';

var client = require('./dbClient'),
    model = {},
    TABLE_NAME = 'account';

// 取得するアカウントはあらかじめ手作業で作成しておく。以下の形式
// {permission: ('admin')|('question'), password: <password>}
model.getAccount = function(permission) {
  return client.readOne(
    TABLE_NAME,
    {
      permission: permission
    }
  );
};

module.exports = model;
