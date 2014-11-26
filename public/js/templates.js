this["JST"] = this["JST"] || {};

this["JST"]["wdquiz.question.choices.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>it is choices</div>';

}
return __p
};

this["JST"]["wdquiz.question.container.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>it is base Layout Template !!\n  <div id="question">question area</div>\n  <div id="choices">choices area</div>\n</div>';

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