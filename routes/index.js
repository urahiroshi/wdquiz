var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/answer', function(req, res) {
  res.render('answer');
});
router.get('/question', function(req, res) {
  res.render('question');
});
router.get('/admin', function(req, res) {
  res.render('admin')
});
module.exports = router;
