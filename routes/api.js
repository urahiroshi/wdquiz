'use strict';

var express = require('express'),
    Q = require('q'),
    answerModel = require('../models/answerModel'),
    answerableQuestionModel = require('../models/answerableQuestionModel'),
    contestModel = require('../models/contestModel'),
    entryModel = require('../models/entryModel'),
    questionModel = require('../models/questionModel'),
    router = express.Router(),
    onErrorBaseGen,
    onSuccessBaseGen,
    onWriteFinishedBaseGen,
    returnError,
    isUpdated;

// ---- private functions ----

isUpdated = function(result, count) {
  count = count || 1;
  console.log("update result: " + JSON.stringify(result));
  return (result === count) || (result.nModified === count);
};

returnError = function(res, statusCode, log) {
  console.log(log);
  res.status(statusCode).send();
};

onErrorBaseGen = function(res) {
  return function(err) {
    returnError(res, 500, err);
  };
};

onSuccessBaseGen = function(res) {
  return function(result) {
    res.json(result);
  }
};

onWriteFinishedBaseGen = function(res) {
    return function(writeResult) {
    var result = {};
    result.isSuccess = isUpdated(writeResult);
    res.json(result);
  }
};

// ---- router functions ----

// 開催中のコンテスト確認
router.get('/contest/', function(req, res) {
  contestModel.readNotFinished()
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// コンテスト開始
router.post('/contest/', function(req, res) {
  // 一旦createのresultをそのまま返す
  contestModel.create()
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// コンテスト集計
router.get('/contest/:contestId/result', function(req, res) {
  var contestId = req.params.contestId,
      getAnswers, getEntryScores;
  getAnswers = function(contestId) {
    return answerModel.get({ contestId: contestId });
  };
  getEntryScores = function(answers) {
    var entryScores = {};
    answers.forEach(function(answer) {
      if (answer.answerPoint > 0) {
        entryScores[answer.entryId] = answer.entryId || { totalPoint: 0, totalTime: 0 };
        entryScores[answer.entryId].totalPoint += answer.answerPoint;
        entryScores[answer.entryId].totalTime += answer.answerTime;
      }
    });
    return entryScores;
  };
  getAnswers(contestId)
    .then(getEntryScores)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// コンテスト終了
router.delete('/contest/:id', function(req, res) {
  contestModel.finish(req.params.id)
    .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
});

// 設問取得
router.post('/answerableQuestion/', function(req, res) {
  var contestId = req.body.contestId,
      getFinishedOrder,
      createAnswerableQuestion;
  getFinishedOrder = function(contest) {
    return contest.finishedOrder;
  };
  createAnswerableQuestion = function(question) {
    return answerableQuestionModel.create(contestId, question);
  };
  contestModel.readOne(contestId)
    .then(getFinishedOrder)
    .then(questionModel.getNext)
    .then(createAnswerableQuestion)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 設問開始
router.put('/answerableQuestion/:id', function(req, res) {
  var id = req.params.id;
  answerableQuestionModel.enable(id)
    .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
});

// 設問要求(エントリーから)
router.get('/answerableQuestion/', function(req, res) {
  var contestId = req.query.contestId;
  answerableQuestionModel.getEnabledQuestion(contestId)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 設問確認(エントリーから)
router.get('/answerableQuestion/:id', function(req, res) {
  var id = req.params.id;
  answerableQuestionModel.getOneWithoutAnswer(id)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 設問終了
router.delete('/answerableQuestion/:id', function(req, res) {
  var id = req.params.id,
      getAnswerableQuestion, endAnswer;
  getAnswerableQuestion = function(writeResult) {
    if(isUpdated(writeResult)) {
      return answerableQuestionModel.getOne(id);
    } else {
      throw new Error("answerableQuesion.finish writeError");
    }
  };
  endAnswer = function(answerableQuestion) {
    var endQuestion, finishOrder, getAnswers, updateAnswers;
    endQuestion = function() {
      return answerableQuestionModel.finish(id);
    };
    finishOrder = function() {
      var order = answerableQuestion.question.order,
        contestId = answerableQuestion.contestId;
      return contestModel.finishOrder(contestId, order);
    };
    getAnswers = function() {
      return answerModel.get({answerableQuestionId: id});
    };
    updateAnswers = function(answers) {
      var correctNumber = answerableQuestion.question.correctNumber,
          updateFunctions;
      updateFunctions = answers.map(function(answer) {
        var answerPoint;
        if (correctNumber === answer.answerNumber) {
          answerPoint = 1;
        } else {
          answerPoint = 0;
        }
        return answerModel.update(answer._id, answerPoint);
      });
      return Q.all(updateFunctions);
    };
    return endQuestion()
      .then(finishOrder)
      .then(getAnswers)
      .then(updateAnswers);
  };
  var checkSuccess = function() {
    var result = {isSuccess: true};
    for(var i=0; i<arguments.length; i++) {
      if (isUpdated(arguments[i])) {
        result.isSuccess = false;
        return result;
      }
    }
    return result;
  };
  answerableQuestionModel.finish(id)
    .then(getAnswerableQuestion)
    .then(endAnswer)
    .spread(checkSuccess)
    .done(function(result){ res.json(result); }, onErrorBaseGen(res));
});

// 設問作成
router.post('/question/', function(req, res) {
  var question = {
    order: Number(req.body.order),
    text: req.body.text,
    choices: req.body.choices,
    correctNumber: Number(req.body.correctNumber),
    timeout: Number(req.body.timeout)
  };
  questionModel.create(question)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 全設問取得
router.get('/question/', function(req, res) {
  questionModel.getAll()
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 設問更新
router.put('/question/:id', function(req, res) {
  var id = req.params.id,
      updateMap;
  updateMap = {
    order: Number(req.body.order),
    text: req.body.text,
    choices: req.body.choices,
    correctNumber: Number(req.body.correctNumber),
    timeout: Number(req.body.timeout)
  };
  questionModel.update(id, updateMap)
    .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
});

// 設問削除
router.delete('/question/:id', function(req, res) {
  var id = req.params.id;
  questionModel.delete(id)
    .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
});

// 参加登録
router.post('/entry/', function(req, res) {
  var contestId = req.body.contestId,
      name = req.body.name;
  entryModel.create(name, contestId)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 参加者情報取得
router.get('/entry/', function(req, res) {
  var contestId = req.query.contestId,
      id = req.query.id;
  if (id) {
    entryModel.getOne(id, contestId)
      .done(onSuccessBaseGen(res), onErrorBaseGen(res));
  } else if (contestId) {
    entryModel.get(contestId)
      .done(onSuccessBaseGen(res), onErrorBaseGen(res));
  } else {
    returnError(res, 400, 'argument error');
  }
});

// 回答送信
router.post('/answer/', function(req, res) {
  var answerableQuestionId = req.body.answerableQuestionId,
      entryId = req.body.entryId,
      answerNumber = Number(req.body.number),
      createAnswer;
  createAnswer = function(answerableQuestion) {
    if (answerableQuestion._id) {
      return answerModel.create(
        entryId,
        answerableQuestionId,
        answerNumber,
        answerableQuestion.contestId,
        answerableQuestion.startDt
      );
    } else {
      return {};
    }
  };
  answerableQuestionModel.getOne(answerableQuestionId)
    .then(createAnswer)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 回答結果取得
router.get('/answer/', function(req, res) {
  var answerableQuestionId = req.query.answerableQuestionId,
      entryId = req.query.entryId,
      contestId = req.query.contestId,
      query;
  if (entryId) {
    answerModel.getOne(answerableQuestionId, entryId)
      .done(onSuccessBaseGen(res), onErrorBaseGen(res));
  } else {
    // TODO: Answerユーザーからはアクセスできないように。。
    if (answerableQuestionId) {
      query = {answerableQuestionId: answerableQuestionId};
    } else if (contestId) {
      query = {contestId: contestId};
    }
    if (query) {
      answerModel.get(query)
        .done(onSuccessBaseGen(res), onErrorBaseGen(res));
    } else {
      onErrorBaseGen(res)("invalid arguments");
    }
  }
});

module.exports = router;
