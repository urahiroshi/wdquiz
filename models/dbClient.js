'use strict';

var dbClient = require('mongodb'),
    url = 'mongodb://localhost:27017/wdquiz',
    Q = require('q'),
    client = {};

client._qConnect = function() {
  var d = Q.defer();
  dbClient.connect(url, function(err, db) {
    if(err == null) {
      d.resolve(db);
    } else {
      d.reject(new Error(err));
    }
  })
  return d.promise;
};

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
client.qRead = function(table, queryMap) {
  return client.qExec(table, function(collection, onFinish){
    collection.find(queryMap).toArray(onFinish);
  });
};

client.read = function(table, queryMap, callback) {
  dbClient.connect(url, function(err, db) {
    var collection = db.collection(table);
    collection.find(queryMap).toArray(function(err, result) {
      db.close();
      callback(err, result);
    });
  });
};

client.qCreate = function(table, insertMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.insert(insertMap, onFinish);
  });
};

client.create = function(table, insertMap, callback) {
  dbClient.connect(url, function(err, db) {
    var collection = db.collection(table);
    collection.insert(insertMap, function(err, result) {
      db.close();
      callback(err, result);
    });
  });
};

client.qUpdate = function(table, queryMap, updateMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.update(
      queryMap,
      { $set: updateMap },
      onFinish
    );
  });
};

client.update = function(table, queryMap, updateMap, callback) {
  dbClient.connect(url, function(err, db) {
    var collection = db.collection(table);
    collection.update(
      queryMap,
      { $set: updateMap },
      function(err, result) {
        db.close();
        callback(err, result);
      }
    );
  });
};

client.qDelete = function(table, queryMap) {
  return client.qExec(table, function(collection, onFinish) {
    collection.remove(queryMap, onFinish);
  });
};

client.delete = function(table, queryMap, callback) {
  dbClient.connect(url, function(err, db) {
    var collection = db.collection(table);
    collection.remove(
      queryMap,
      function(err, result) {
        db.close();
        callback(err, result);
      }
    );
  });
};

module.exports = client;
