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

model.get = function(contestId) {
  return client.readOne(
    TABLE_NAME,
    {
      contestId: contestId,
      $orderby: { startDt: 1 }
    }
  );
};

model.getEnabledQuestion = function(contestId) {
  return client.readOne(
    TABLE_NAME,
    {
      contestId: contestId,
      isEnabled: true
    }
  );
};

model.isTimeout = function(id) {
  return model.getOne(id)
    .then(function(answerableQuestion) {
      return (answerableQuestion.endDt < dt.now());
    });
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
    var now = dt.now();
    if(enabledQuestion._id) {
      return client.create(
        TABLE_NAME,
        {
          question: question,
          contestId: contestId,
          startDt: now,
          endDt: now.addSeconds(enabledQuestion.timeout),
          isEnabled: true
        }
      );
    } else {
      console.log('他に有効なanswerableQuestionが存在します');
      return enabledQuestion;
    }
  };
  return model.getEnabledQuestion(contestId)
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
