'use strict';

require('date-utils');

var http = require('http')
  , url = require('url')
  , host = '192.168.0.12'
  , port = '3000'
  , root = '/api'
  , reqInterval = 10
  , mergeObj
  , sendGetRequest
  , sendPostRequest
  , apiRequest;

sendGetRequest = function(path, onGetData) {
  var req = apiRequest(path, 'GET', onGetData);
  req.end();
};

sendPostRequest = function(path, data, onGetData) {
  var dataStr = JSON.stringify(data)
    , options = {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataStr.length
      }
    }
    , req = apiRequest(path, 'POST', onGetData);
  req.write(JSON.stringify(data));
  req.end();
};

apiRequest = function(path, method, onGetData, options) {
  console.log('path: ' + path + ', method: ' + method);
  var optionsArg = options || {}
    , options = {
      hostname: host,
      port: port,
      path: root + path,
      method: method
    };
  for (var key in optionsArg) {
    options[key] = optionsArg[key];
  }

  var req = http.request(options, function(res) {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      var result = JSON.parse(body);
      onGetData(result);
    });
  });
  req.on('error', function(e) {
    console.log('error occured: ' + e.message);
  });
  return req;
};

sendGetRequest('/contest/', function(contest) {
  if (contest['_id']) {
    var contestId = contest['_id']
      , interval = setInterval(function() {
        var start = new Date();
        sendGetRequest('/answerableQuestion/', function(answerableQuestion) {
          var delay = String(new Date() - start);
          if (answerableQuestion._id) {
            console.log(delay + 'ms answerableQuestion.Found')
          } else {
            console.log(delay + 'ms answerableQuestion.NotFound')
          }
        });
      }, reqInterval);
  }
});
