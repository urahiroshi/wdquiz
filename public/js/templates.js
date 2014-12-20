this["JST"] = this["JST"] || {};

this["JST"]["wdquiz.question.base.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="container">\r\n</div>';

}
return __p
};

this["JST"]["wdquiz.question.choices.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>it is choices</div>';

}
return __p
};

this["JST"]["wdquiz.question.question.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>it is question</div>';

}
return __p
};

this["JST"]["wdquiz.question.quiz.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>it is base Layout Template !!\n  <div id="timer">' +
((__t = ( _timer )) == null ? '' : __t) +
'</div>\n  <div id="question">' +
((__t = ( answerableQuestion.question.text )) == null ? '' : __t) +
'</div>\n  <div id="choices">\n    ';
 _.each(answerableQuestion.question.choices, function(choice) { ;
__p += '\n      <div>' +
((__t = ( choice.label )) == null ? '' : __t) +
'</div>\n    ';
 }); ;
__p += '\n  </div>\n</div>';

}
return __p
};

this["JST"]["wdquiz.question.register.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\r\n  register page.\r\n</div>';

}
return __p
};

this["JST"]["wdquiz.question.result.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\r\n  result page.\r\n</div>';

}
return __p
};

this["JST"]["wdquiz.question.timing.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\r\n  timing page.\r\n</div>';

}
return __p
};

this["JST"]["wdquiz.question.wait.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\r\n  wait page.\r\n</div>';

}
return __p
};