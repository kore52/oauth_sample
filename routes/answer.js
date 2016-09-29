var express = require('express');
var router = express.Router();

var model = require('../model');
var User = model.User;
var Problem = model.Problem;

router.post('/', function(req, res, next) {

    try {
        var post_id = req.body.problem_id;
        var post_answer = req.body.answer;

        Problem.findOne({ answer: post_answer }, function(err, problem) {
            // ÉtÉâÉOÇ™àÍívÇ∑ÇÈñ‚ëËÇ™Ç»Ç¢
            if (err) {
                res.send('{"status":"Invalid answer"}');
            }
            
            // ê≥â
            var condition = { provider: req.user.provider, provider_id: req.user.id };
            User.findOne(condition, function(err, user) {
                if (err) throw "user not found.";
                var answered_list = user.answered_problem;
                console.log(answered_list);
                if (!(problem.problem_id in answered_list)) {
                    answered_list[problem.problem_id] = true;
                    var update = { answered_problem: answered_list, updated: new Date().toISOString() };
                    User.findOneAndUpdate(condition, update, {new: true}, function(err, user) {
                        if (err) throw "user not found.";
                        console.log("user: " + user);
                        console.log("ans: " + answered_list);
                    });
                }
            });
            

            res.end('{"status":"ok"}');

        });

    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
