'use strict';

require('date-utils');

var handler = {};
handler.now = function() {
  return new Date();
};

handler.toStr = function(dt) {
  return dt.toFormat('YYYY/MM/DD HH24:MI:SS');
};

handler.getDate = function(originDate, addDay) {
  var result = new Date(originDate.getTime());
  result.setDate(result.getDate + addDay);
  return result;
};

module.exports = handler;