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
            
            // フラグが一致する問題がない
            if (problems.length == 0) {
                res.send('{"status":"Invalid answer"}');
            }
            
            // 正解
            User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, users) {
                var user = users[0];
                
                // 正解一覧にproblem_idを追加
                User.update({ provider: req.user.provider, provider_id: req.user.id },
                    { answered_problem: user.answered_problem + "," + problem.problem_id });
                    
                console.log(user, req.user);
            });

            res.end('{"status":"ok"}');

        });

    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
