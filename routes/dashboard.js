var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // 回答状況を検索
    ////////////////////////////////////////////////////////////////
    // MongoDB初期化
    var model = require('./model.js');
    var User = model.User;
    var Score = model.Score;
    
    User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
      Score.find({ user_id: user._id }, function(err, scores) {
        res.render('dashboard', { title: 'CTF Dashboard', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4), scores: scores });
      });
    });
  } else {
    res.redirect('../');
  }
});

module.exports = router;
