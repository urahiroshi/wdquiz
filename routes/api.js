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
    onWriteFinishedBaseGen;

// ---- private functions ----
onErrorBaseGen = function(res) {
  return function(err) {
    console.log(err);
    res.status(500).send();
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
    result.isSuccess = (writeResult.nModified === 1);
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
      if (answer.isCorrect) {
        entryScores[answer.entryId] = answer.entryId || { totalCorrect: 0, totalTime: 0 };
        entryScores[answer.entryId].totalCorrect += 1;
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

// 設問開始
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

// 設問要求
router.get('/answerableQuestion/', function(req, res) {
  var contestId = res.query.contestId,
      hideAnswer;
  hideAnswer = function(answerableQuestion) {
    var question = {
      order: answerableQuestion.order,
      text: answerableQuestion.text,
      choices: answerableQuestion.choices,
      timeout: answerableQuestion.timeout
    };
    answerableQuestion.question = question;
    return answerableQuestion;
  };
  answerableQuestionModel.getEnabledQuestion(contestId)
    .then(hideAnswer)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 設問終了
router.delete('/answerableQuestion/:id', function(req, res) {
  var id = req.params.id,
      getAnswerableQuestion, endAnswer;
  getAnswerableQuestion = function(writeResult) {
    if(writeResult.result.nModified === 1) {
      return answerableQuestionModel.getOne(id);
    } else {
      throw new Error("answerableQuesion.finish writeError");
    }
  };
  endAnswer = function(answerableQuestion) {
    var endQuestion, finishOrder, getAnswers, updateAnswers;
    endQuestion = function() {
      return answerableQuestionModel.finish(answerableQuestion._id);
    };
    finishOrder = function() {
      var order = answerableQuestion.question.order,
        contestId = answerableQuestion.contestId;
      return contestModel.finishOrder(contestId, order);
    };
    getAnswers = function() {
      return answerModel.get({answerableQuestionId: answerableQuestion._id});
    };
    updateAnswers = function(answers) {
      var correctNumber = answerableQuestion.question.correctNumber,
          updateFunctions;
      updateFunctions = answers.map(function(answer) {
        return function() {
          var isCorrect = (correctNumber === answer.answerNumber);
          return answerModel.update(answer._id, isCorrect);
        };
      });
      return Q.all(updateFunctions);
    };
    return endQuestion()
      .then(finishOrder)
      .then(getAnswers)
      .then(updateAnswers);
  };
  answerableQuestionModel.finish(id)
    .then(getAnswerableQuestion)
    .then(endAnswer)
    .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
});

// 設問作成
router.post('/question/', function(req, res) {
  var question = {
    order: req.body.order,
    text: req.body.text,
    choices: req.body.choices,
    correctNumber: req.body.correctNumber,
    timeout: req.body.timeout
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
    order: req.body.order,
    text: req.body.text,
    choices: req.body.choices,
    correctNumber: req.body.correctNumber,
    timeout: req.body.timeout
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
router.post('/entry', function(req, res) {
  var contestId = req.body.contestId,
      name = req.body.name;
  entryModel.create(name, contestId)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 参加者情報取得
router.get('/entry/', function(req, res) {
  var contestId = req.query.contestId,
      name = req.query.name;
  if (name) {
    entryModel.getOne(name)
      .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
  } else if (contestId) {
    entryModel.get(contestId)
      .done(onWriteFinishedBaseGen(res), onErrorBaseGen(res));
  }
  entryModel.get(contestId)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 回答送信
router.post('/answer/', function(req, res) {
  var answerableQuestionId = req.query.answerableQuestionId,
      entryId = req.query.entryId,
      answerNumber = req.query.number,
      createAnswer;
  createAnswer = function(answerableQuestion) {
    return answerModel.create(
      entryId,
      answerableQuestionId,
      answerNumber,
      answerableQuestion.contestId,
      answerableQuestion.startDt
    );
  };
  answerableQuestionModel.getOne(answerableQuestionId)
    .then(createAnswer)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

// 回答結果取得
router.get('/answer/', function(req, res) {
  var answerableQuestionId = req.query.answerableQuestionId,
      entryId = req.query.entryId;
  answerModel.getOne(answerableQuestionId, entryId)
    .done(onSuccessBaseGen(res), onErrorBaseGen(res));
});

module.exports = router;
