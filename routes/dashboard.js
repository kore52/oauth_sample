var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // �񓚏󋵂�����
    ////////////////////////////////////////////////////////////////
    // MongoDB������
    var User = require('./models/User').User;
    var Score = require('./models/Score').Score;
    
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
