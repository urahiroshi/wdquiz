'use strict';

require('date-utils');

var handler = {};
handler.now = function() {
  return new Date();
};

handler.toStr = function(dt) {
  return dt.toFormat('YYYY/MM/DD HH24:MI:SS');
};

module.exports = handler;