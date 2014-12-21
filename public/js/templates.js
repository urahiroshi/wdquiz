this["JST"] = this["JST"] || {};

this["JST"]["wdquiz.admin.question.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>\r\n  <p>設問情報を入力してください。</p>\r\n  <div>\r\n    <input type="button" class="btnAdd" value="追加" />\r\n  </div>\r\n  <table>\r\n    <thead>\r\n      <tr>\r\n        <th>order</th>\r\n        <th>text</th>\r\n        <th>choices</th>\r\n        <th>correctNumber</th>\r\n        <th>timeout</th>\r\n        <th>操作</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      ';
 _.each(question, function(aQuestion) { ;
__p += '\r\n      <tr>\r\n        <td>' +
((__t = ( aQuestion.order )) == null ? '' : __t) +
'</td>\r\n        <td>' +
((__t = ( aQuestion.text )) == null ? '' : __t) +
'</td>\r\n        <td>\r\n          <table>\r\n            ';
 _.each(aQuestion.choices, function(choice) { ;
__p += '\r\n            <tr>\r\n              <td>' +
((__t = ( choice.number )) == null ? '' : __t) +
'</td>\r\n              <td>' +
((__t = ( choice.label )) == null ? '' : __t) +
'</td>\r\n              <td>' +
((__t = ( choice.image )) == null ? '' : __t) +
'</td>\r\n            </tr>\r\n            ';
 }); ;
__p += '\r\n          </table>\r\n        </td>\r\n        <td>' +
((__t = ( aQuestion.correctNumber )) == null ? '' : __t) +
'</td>\r\n        <td>' +
((__t = ( aQuestion.timeout )) == null ? '' : __t) +
'</td>\r\n        <td>\r\n          <div id="' +
((__t = ( aQuestion._id )) == null ? '' : __t) +
'">\r\n            <input type="button" class="btnEdit" value="編集" />\r\n            <input type="button" class="btnDelete" value="削除" />\r\n          </div>\r\n        </td>\r\n      </tr>\r\n      ';
 }); ;
__p += '\r\n    </tbody>\r\n  </table>\r\n</div>';

}
return __p
};

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