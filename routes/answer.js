var express = require('express');
var router = express.Router();

var model = require('../model');
var User = model.User;
var Problem = model.Problem;

router.post('/', function(req, res, next) {

    try {
        var post_id = req.body.problem_id;
        var post_answer = req.body.answer;

        Problem.find({ answer: post_answer }, function(err, problems) {
            var problem = problems[0];
            
            // ƒtƒ‰ƒO‚ªˆê’v‚·‚é–â‘è‚ª‚È‚¢
            if (problems.length == 0) {
                res.send('{"status":"Invalid answer"}');
            }
            
            // ³‰ğ
            var condition = { provider: req.user.provider, provider_id: req.user.id };
            var update = { answered_problem: user.answered_problem + "," + problem.problem_id };
            User.findOneAndUpdate(condition, update, {new: true}, function(err, user) {
                if (err) throw "user not found.";
                console.log("user: " + user);
            });

            res.end('{"status":"ok"}');

        });

    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
