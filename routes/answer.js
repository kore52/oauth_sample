var express = require('express');
var router = express.Router();

// MongoDBèâä˙âª
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
var UserSchema = new Schema({
  provider: { type: String, required: true },
  provider_id: { type: String, required: true },
  nickname: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
*/
var ScoreSchema = new Schema({
  user_id: { type: String, required: true },
  problem_id: { type: String, required: true },
  score: { type: Number }
});

var mongodb_uri = process.env.MONGODB_URI || '';
//mongoose.model('User', UserSchema);
mongoose.model('Score', ScoreSchema);
mongoose.Promise = global.Promise;
//mongoose.connect(mongodb_uri);
var User = mongoose.model('User');
var Score = mongoose.model('Score');

router.post('/', function(req, res, next) {
  console.log('access answer');
  if (req.isAuthenticated()) {
    var answer = {
      "1" : {
        answer : "CTFTUTORIAL",
        score : 30
      }
    };
    
    try {
      var post_id = req.body.problem_id;
      var post_answer = req.body.answer;
      
      if (answer[post_id].answer == post_answer) {
        User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
          Score.find({ user_id: user._id }, function(err, score) {
            if (score.length == 0) {
              var score = new Score({ user_id : user._id, problem_id : post_id, score : answer[post_id].score });
              score.save(function(err) {
                if (err) { console.log(err); }
              });
            }
          });
          res.send("Valid answer.");
        });
      } else {
        res.send("Invalid answer.");
      }
    } catch (e) {
      res.send("Invalid data.");
    }
  } else {
    res.redirect('../');
  }
});

module.exports = router;
