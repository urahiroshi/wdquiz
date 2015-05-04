'use strict';

var dbClient = require('mongodb'),
    ObjectID = require('mongodb').ObjectID,
    Q = require('q'),
    url = 'mongodb://localhost:27017/wdquiz',
    log, startLog, endLog,
    replaceId, addId,
    client = {};

log = function(text, params) {
  var paramStrs = params.map(function(param) {
    if(typeof param === 'object') {
      return JSON.stringify(param);
    } else {
      return param;
    }
  });
  var logTexts = [text, paramStrs.join(', ')];
  console.log(logTexts.join(''));
};

startLog = function(crud, params) {
  var text = '[DB] ' + crud + ' called by: ';
  log(text, params);
};

endLog = function(tag, params) {
  var text = '[DB] ' + tag + ' : ';
  log(text, params);
};

replaceId = function(queryMap) {
  if(queryMap._id) {
    queryMap._id = new ObjectID(queryMap._id);
  }
};

addId = function(queryMap) {
  if(!queryMap._id) {
    queryMap._id = new ObjectID();
  }
  return queryMap._id;
};

client.qExec = function(table, onCollect) {
  var onFinishGen,
      onConnect,
      d = Q.defer();
  onFinishGen = function(db) {
    return function(err, result) {
      db.close();
      if(err == null) {
        endLog('success', [result]);
        d.resolve(result);
      } else {
        endLog('error', [err]);
        d.reject(new Error(err));
      }
    };
  };
  onConnect = function(err, db) {
    if (db) {
      var collection = db.collection(table);
      onCollect(collection, onFinishGen(db));
    } else {
      endLog('error', "db is null");
      d.reject(new Error());
    }
  };
  dbClient.connect(url, onConnect);
  return d.promise;
};

// get exaple: client.qRead('test',{}).done(function(result){console.log(result);});
client.read = function(table, queryMap) {
  startLog('read', [table, queryMap]);
  replaceId(queryMap);
  var onCollect = function(collection, onFinish) {
    collection.find(queryMap).toArray(onFinish);
  };
  return client.qExec(table, onCollect);
};

client.readOne = function(table, queryMap) {
  startLog('readOne', [table, queryMap]);
  replaceId(queryMap);
  var onCollect = function(collection, onFinish) {
    collection.find(queryMap).toArray(function(err, docs){
      var result = {};
      if(docs && docs.length > 0) {
        result = docs[0];
      }
      onFinish(err, result);
    });
  };
  return client.qExec(table, onCollect);
};

/*
 * レコードを作成する。
 * 作成したレコードの情報を返すため、_idを自分で生成して覚えておき、
 * レコード作成に成功したら_idを持つレコード(作成したレコード)の情報を返す。
 */
client.create = function(table, insertMap) {
  startLog('create', [table, insertMap]);
  var _id = addId(insertMap);
  return client.qExec(table, function(collection, onFinish) {
    collection.insert(insertMap, onFinish);
  }).then(function(result) {
      return client.readOne(table, {_id: _id});
  });
};

client.update = function(table, queryMap, updateMap) {
  startLog('update', [table, queryMap, updateMap]);
  replaceId(queryMap);
  return client.qExec(table, function(collection, onFinish) {
    collection.update(
      queryMap,
      { $set: updateMap },
      onFinish
    );
  });
};

client.delete = function(table, queryMap) {
  startLog('delete', [table, queryMap]);
  replaceId(queryMap);
  return client.qExec(table, function(collection, onFinish) {
    collection.remove(queryMap, onFinish);
  });
};

client.successToModify = function(result, targetCount) {
  if (typeof targetCount === 'undefined') {
    targetCount = 1;
  }
  return (result === targetCount) ||
          (result.nModified === targetCount) ||
          (result.result && result.result.n === targetCount)
};

module.exports = client;
