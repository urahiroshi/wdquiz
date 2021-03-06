'use strict';

var client = require('./dbClient'),
    dt = require('./dtHandler'),
    answerModel = require('./answerModel'),
    Q = require('q'),
    ObjectID = require('mongodb').ObjectID,
    model = {},
    TABLE_NAME = 'answerableQuestion',
    hideAnswer;

hideAnswer = function(answerableQuestion) {
  if(answerableQuestion._id) {
    var i,
        choicesLen = answerableQuestion.question.choices.length;
    answerableQuestion.question.correctNumber = -1;
    for (i = 0; i < choicesLen; i++) {
      answerableQuestion.question.choices[i].label = '';
    }
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

model.getVisibleQuestion = function(contestId, byEntry) {
  return this._getOne(
    {
      contestId: contestId,
      isVisible: true
    },
    byEntry
  );
};

/*
 * 設問を開始時に使用される。
 * 他に有効なanswerableQuestionがないか確認し、
 * なければ引数のquestionに対応するanswerableQuestionを作成して返し、
 * 他に有効なanswerableQuestionがあればそれを削除して新規作成する。
 * questionが空で要求された場合(次の設問がない場合)は空を返す
 */
model.create = function(contestId, question) {
  var onGetUnfinishedQuestion, create;
  if(!question._id) {
    return {};
  }
  onGetUnfinishedQuestion = function(enabledQuestion) {
    if (enabledQuestion._id) {
      console.log('他に有効なanswerableQuestionが存在するため、削除します');
      return model.delete(enabledQuestion._id);
    } else {
      return null;
    }
  };
  create = function(deleteResult) {
    if (deleteResult) {
      if (!client.successToModify(deleteResult, 1)) {
        return Q.reject('既存のanswerableQuestionの削除に失敗しました。');
      }
    }
    return client.create(
      TABLE_NAME,
      {
        question: question,
        contestId: contestId,
        isVisible: false,
        isFinished: false
      }
    );
  };

  return this.getUnfinishedQuestion(contestId, false)
    .then(onGetUnfinishedQuestion)
    .then(create);
};

model.changeVisible = function(id, visible) {
  var updateMap = { isVisible: visible},
      now = dt.now(),
      updateClient;
  updateClient = function(answerableQuestion) {
    if (visible) {
      updateMap.startDt = now;
      updateMap.endDt = dt.addSeconds(now, answerableQuestion.question.timeout);
    }
    return client.update(
        TABLE_NAME,
        {
          _id: id
        },
        updateMap
    );
  };
  return model.getOne(id, false)
    .then(updateClient);
};

model.finish = function(id) {
  return client.update(
    TABLE_NAME,
    {
      _id: id
    },
    {
      isFinished: true,
      endDt: dt.now()
    }
  );
};

model.delete = function(id) {
  var deleteAnswers, deleteAnswerableQuestion,
      answersCount = 0,
      idStr = String(id);
  deleteAnswers = function(answers) {
    if (answers.length > 0) {
      answersCount = answers.length;
      return answerModel.delete(idStr);
    } else {
      return 0;
    }
  };
  deleteAnswerableQuestion = function(deleteResult) {
    console.log(String(answersCount) + '個のanswerを削除します。');
    if (!client.successToModify(deleteResult, answersCount)) {
      return Q.reject('answerの削除に失敗しました。');
    }
    return client.delete(
      TABLE_NAME,
      {
        _id: id
      }
    );
  };
  return answerModel.get(idStr)
    .then(deleteAnswers)
    .then(deleteAnswerableQuestion);
};

module.exports = model;
