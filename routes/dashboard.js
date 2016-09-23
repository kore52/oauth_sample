var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // ‰ñ“šó‹µ‚ğŒŸõ
    ////////////////////////////////////////////////////////////////
    // MongoDB‰Šú‰»
    var Schema = mongoose.Schema;
    var mongodb_uri = process.env.MONGODB_URI || '';
//    mongoose.Promise = global.Promise;
//    mongoose.connect(mongodb_uri);
    var User = mongoose.model('User');
    var Score = mongoose.model('Score');
    
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
