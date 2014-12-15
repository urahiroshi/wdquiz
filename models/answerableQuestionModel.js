'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answerableQuestion';

model.getOne = function(id) {
  return client.readOne(
    TABLE_NAME,
    {
      _id: id
    }
  );
};

model.getEnabledQuestion = function() {
  return client.readOne(
    TABLE_NAME,
    {
      isEnabled: true
    }
  );
};

/*
 * 設問を開始時に使用される。
 * 他に有効なanswerableQuestionがないか確認し、
 * なければ引数のquestionに対応するanswerableQuestionを作成して返し、
 * 他に有効なanswerableQuestionがあればその値を返す。
 * questionが空で要求された場合は空を返す(次の設問がない場合を想定)
 */
model.create = function(contestId, question) {
  var onGetEnabledQuestion;
  if(!question._id) {
    return {};
  }
  onGetEnabledQuestion = function(enabledQuestion) {
    if(enabledQuestion._id) {
      return client.create(
        TABLE_NAME,
        {
          question: question,
          contestId: contestId,
          startDt: dt.now(),
          isEnabled: true
        }
      );
    } else {
      console.log('他に有効なanswerableQuestionが存在します');
      return enabledQuestion;
    }
  };
  return model.getEnabledQuestion()
    .then(onGetEnabledQuestion);
};

model.finish = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isEnabled: false,
      endDt: dt.now()
    }
  );
};

module.exports = model;
