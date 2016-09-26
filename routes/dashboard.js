var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // ‰ñ“šó‹µ‚ğŒŸõ
    ////////////////////////////////////////////////////////////////
    // MongoDB‰Šú‰»
    var model = require('../model');
    var User = model.User;
    var Score = model.Score;
    
    User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
      Score.find({ user_id: user[0]._id }, function(err, scores) {
        console.log(JSON.stringify(scores[0]));
        var dic_scores = {}
        scores.every(function(s) {
          dic_scores[s.problem_id].score = s.score;
        });
        res.render('dashboard', { title: 'CTF Dashboard', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4), scores: dic_scores });
      });
    });
  } else {
    res.redirect('../');
  }
});

module.exports = router;
