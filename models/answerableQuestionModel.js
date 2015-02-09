'use strict';

var client = require('./dbClient'),
    model = {},
    dt = require('./dtHandler'),
    TABLE_NAME = 'answerableQuestion',
    hideAnswer;

hideAnswer = function(answerableQuestion) {
  if(answerableQuestion._id) {
    answerableQuestion.question.correctNumber = -1;
  }
  return answerableQuestion;
};

model._getOne = function(query, byEntry) {
  var answerableQuestion = client.readOne(TABLE_NAME, query);
  if (byEntry) {
    return answerableQuestion.then(hideAnswer);
  } else {
    return answerableQuestion;
  }
};

model.getOne = function(id, byEntry) {
  return this._getOne(
    {
      _id: id
    },
    byEntry
  );
};

model.get = function(contestId) {
  return client.readOne(
    TABLE_NAME,
    {
      $query: {
        contestId: contestId
      },
      $orderby: { startDt: 1 }
    }
  );
};

model.getUnfinishedQuestion = function(contestId) {
  return this._getOne(
    {
      contestId: contestId,
      isFinished: false
    },
    false
  );
};

model.getEnabledQuestion = function(contestId, byEntry) {
  return this._getOne(
    {
      contestId: contestId,
      isEnabled: true
    },
    byEntry
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
    var now = dt.now();
    if(enabledQuestion._id) {
      console.log('他に有効なanswerableQuestionが存在します');
      return enabledQuestion;
    } else {
      return client.create(
        TABLE_NAME,
        {
          question: question,
          contestId: contestId,
          startDt: now,
          endDt: now.addSeconds(enabledQuestion.timeout),
          isEnabled: false,
          isFinished: false
        }
      );
    }
  };
  return this.getEnabledQuestion(contestId, false)
    .then(onGetEnabledQuestion);
};

model.enable = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isEnabled: true
    }
  );
};

model.finish = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isEnabled: false,
      isFinished: true,
      endDt: dt.now()
    }
  );
};

module.exports = model;
