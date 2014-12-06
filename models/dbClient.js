'use strict';

var dbClient = require('mongodb'),
    url = 'mongodb://localhost:27017/wdquiz',
    Q = require('q'),
    client = {};

client.qExec = function(table, dbExec) {
  var d = Q.defer();
  dbClient.connect(url, function(err, db) {
    var collection = db.collection(table);
    dbExec(
      collection,
      function(err, result) {
        db.close();
        if(err == null) {
          d.resolve(result);
        } else {
          d.reject(new Error(err));
        }
      }
    );
  });
  return d.promise;
};

// get exaple: client.qRead('test',{}).done(function(result){console.log(result);});
client.read = function(table, queryMap) {
  return client.qExec(table, function(collection, onFinish){
    collection.find(queryMap).toArray(onFinish);
  });
};

client.create = function(table, insertMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.insert(insertMap, onFinish);
  });
};

client.update = function(table, queryMap, updateMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.update(
      queryMap,
      { $set: updateMap },
      onFinish
    );
  });
};

client.delete = function(table, queryMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.remove(queryMap, onFinish);
  });
};

module.exports = client;
