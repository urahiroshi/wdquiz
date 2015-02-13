'use strict';

require('date-utils');

var handler = {};
handler.now = function() {
  return new Date();
};

handler.toStr = function(dt) {
  return dt.toFormat('YYYY/MM/DD HH24:MI:SS');
};

handler._Clone = function(originDate) {
  return new Date(originDate.getTime());
};

handler.addDays = function(originDate, days) {
  var result = handler._Clone(originDate);
  result.addDays(days);
  return result;
};

handler.addSeconds = function(originDate, seconds) {
  var result = handler._Clone(originDate);
  result.addSeconds(seconds);
  return result;
};

module.exports = handler;