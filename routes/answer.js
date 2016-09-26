var express = require('express');
var router = express.Router();

var model = require('../model');
var User = model.User;
var Score = model.Score;

router.post('/', function(req, res, next) {
  console.log(req.body);

  var answer = {
    "problem_1" : {
      answer : "CTFTUTORIAL",
      score : 30
    }
  };

  try {
    var post_id = req.body.problem_id;
    var post_answer = req.body.answer;
    
    if (answer[post_id].answer == post_answer) {
      User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
        Score.find({ user_id: user._id, problem_id : post_id }, function(err, score) {
          if (score.length == 0) {
            var score = new Score({ user_id : user[0]._id, problem_id : post_id, score : answer[post_id].score });
            score.save(function(err) {
              if (err) { console.log(err); }
              else { console.log('correct!'); }
            });
          }
        });
        res.end('{"status":"ok"}');
      });
    } else {
      res.send('{"status" : "Invalid answer"}');
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
