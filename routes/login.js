var express = require('express');
var session = require('express-session');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  if (req.body.username) {
    req.session.user = {name: req.body.username};
    res.redirect('/');
  } else {
    var err = '入力が正しくありません。';
    res.render('login', {error: err});
  }
})
module.exports = router;
