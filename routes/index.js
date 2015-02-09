var express = require('express'),
    router = express.Router(),
    sessionModel = require('../models/sessionModel'),
    accountModel = require('../models/accountModel'),
    checkQuestionPermission;

checkQuestionPermission = function(req, res, next) {
  var onGetPermission;
  onGetPermission = function(hasPermission) {
    if (hasPermission) {
      next();
    } else {
      res.redirect('/loginQuestion');
    }
  };
  sessionModel.hasPermission(req.cookies, sessionModel.PERMISSION.QUESTION)
    .then(onGetPermission)
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/answer', function(req, res) {
  res.render('answer');
});
router.get('/question', checkQuestionPermission, function(req, res) {
  res.render('question');
});
router.get('/admin', function(req, res) {
  res.render('admin');
});
router.get('/loginQuestion', function(req, res) {
  res.render('login', { message: 'ログインしてください。', url: '/loginQuestion' });
});
router.post('/loginQuestion', function(req, res) {
  var password = req.body.password,
      checkAccount,
      onCreateSession, onFailure;
  onFailure = function() {
    res.render('login', { message: 'ログインに失敗しました。', url: '/loginQuestion' });
  };
  onCreateSession = function(session) {
    if (session && session.sessionId) {
      res.cookie(
        sessionModel.PERMISSION.QUESTION + '.' + sessionModel.SESSIONID,
        session.sessionId,
        { maxAge: 86400000, httpOnly: true }
      );
      res.render('login', {message: 'ログインに成功しました。', url: '/loginQuestion' });
    } else {
      onFailure();
    }
  };
  checkAccount = function(account) {
    if (account.password === password) {
      return sessionModel.createQuestionSession();
    } else {
      return {};
    }
  };
  accountModel.getAccount(sessionModel.PERMISSION.QUESTION)
    .then(checkAccount)
    .done(onCreateSession, onFailure);
});

module.exports = router;
