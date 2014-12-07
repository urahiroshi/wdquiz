'use strict';

var dbClient = require('mongodb'),
    Q = require('q'),
    url = 'mongodb://localhost:27017/wdquiz',
    client = {};

client.qExec = function(table, onCollect) {
  var onFinishGen,
      onConnect,
      d = Q.defer();
  onFinishGen = function(db) {
    return function(err, result) {
      db.close();
      if(err == null) {
        d.resolve(result);
      } else {
        d.reject(new Error(err));
      }
    };
  };
  onConnect = function(err, db) {
    var collection = db.collection(table);
    onCollect(collection, onFinishGen(db));
  };
  dbClient.connect(url, onConnect);
  return d.promise;
};

// get exaple: client.qRead('test',{}).done(function(result){console.log(result);});
client.read = function(table, queryMap) {
  var onCollect = function(collection, onFinish) {
    collection.find(queryMap).toArray(onFinish);
  };
  return client.qExec(table, onCollect);
};

client.readOne = function(table, queryMap) {
  var onCollect = function(collection, onFinish) {
    collection.find(queryMap).toArray(function(err, result){
      result = result[0];
      onFinish(err, result);
    });
  };
  return client.qExec(table, onCollect);
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
