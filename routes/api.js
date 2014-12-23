'use strict';

var express = require('express'),
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

// 設問終了
router.delete('/answerableQuestion/:id', function(req, res) {
  var id = req.params.id,
      getAnswerableQuestion,
      finishOrder;
  getAnswerableQuestion = function(writeResult) {
    if(writeResult.result.nModified === 1) {
      return answerableQuestionModel.getOne(id);
    } else {
      throw new Error("answerableQuesion.finish writeError");
    }
  };
  finishOrder = function(answerableQuestion) {
    var order = answerableQuestion.question.order,
        contestId = answerableQuestion.contestId;
    return contestModel.finishOrder(contestId, order);
  };
  answerableQuestionModel.finish(id)
    .then(getAnswerableQuestion)
    .then(finishOrder)
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

module.exports = router;
