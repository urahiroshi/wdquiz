var express = require('express'),
    answerModel = require('../models/answerModel'),
    answerableQuestionModel = require('../models/answerableQuestionModel'),
    contestModel = require('../models/contestModel'),
    entryModel = require('../models/entryModel'),
    questionModel = require('../models/questionModel'),
    router = express.Router(),
    onErrorBase,
    onWriteFinishedBaseGen;

// ---- private functions ----
onErrorBase = function(err) {
  console.log(err);
};

onSuccessBaseGen = function(res) {
  function(result) {
    res.json(result);
  }
};

onWriteFinishedBaseGen = function(res) {
    function(writeResult) {
    var result = {};
    result.isSuccess = (writeResult.nModified === 1);
    res.json(result);
  }
};

// ---- router functions ----

// コンテスト開始
router.post('/contest/', function(req, res) {
  // 一旦createのresultをそのまま返す
  contestModel.create()
    .done(onSuccessBaseGen(res), onErrorBase);
});

// コンテスト終了
router.delete('/contest/', function(req, res) {
  contestModel.finish(req.body.id)
    .done(onWriteFinishedBaseGen(res), onErrorBase);
});

// 設問開始
router.post('/answerableQuestion/', function(req, res) {
  var id = req.body.contestId,
      getFinishedOrder,
      createAnswerableQuestion;
  getFinishedOrder = function(contest) {
    return contest.finishedOrder;
  };
  createAnswerableQuestion = function(question) {
    return answerableQuestionModel.create(id, question._id);
  };
  contestModel.readOne(id)
    .then(getFinishedOrder)
    .then(questionModel.getNext)
    .then(createAnswerableQuestion)
    .done(onSuccessBaseGen(res), onErrorBase);
});

// 設問終了
router.delete('/answerableQuestion/', function(req, res) {
  var id = req.body.id,
      contestId,
      getQuestionId,
      finishOrder;
  getQuestion = function(answerableQuestion) {
    contestId = answerableQuestion.contestId;
    var questionId = answerableQuestion.questionId;
    return questionModel.getOne(questionId);
  };
  finishOrder = function(question) {
    var order = question.order;
    return contestModel.finishOrder(contestId, order);
  };
  answerableQuestionModel.finish(id)
    .then(getQuestion)
    .then(finishOrder)
    .done(onWriteFinishedBaseGen(res), onErrorBase);
});

// 設問作成
router.post('/question/', function(req, res) {
  var question = {
    order: req.body.order,
    text: req.body.text,
    choices: req.body.choices,
    correctAnswer: req.body.correctAnswer,
    timeout: req.body.timeout
  };
  questionModel.create(question)
    .done(onSuccessBaseGen(res), onErrorBase);
});

// 設問取得
router.get('/question/', function(req, res) {
  questionModel.getAll()
    .done(onSuccessBaseGen(res), onErrorBase);
});

// 設問更新
router.put('/question/', function(req, res) {
  var id = req.body.id,
      updateMap;
  updateMap = {
    order: req.body.order,
    text: req.body.text,
    choices: req.body.choices,
    correctAnswer: req.body.correctAnswer,
    timeout: req.body.timeout
  };
  questionModel.update(id, updateMap)
    .done(onWriteFinishedBaseGen(res), onErrorBase);
});

// 設問削除
router.delete('/question/', function(req, res) {
  var id = req.body.id;
  questionModel.delete(id)
    .done(onWriteFinishedBaseGen(res), onErrorBase);
});

module.exports = router;
