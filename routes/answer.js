var express = require('express');
var router = express.Router();

var model = require('../model');
var User = model.User;
var Problem = model.Problem;

router.post('/', function(req, res, next) {

    try {
        var post_id = req.body.problem_id;
        var post_answer = req.body.answer;

        Problem.find({ answer: post_answer }, function(err, problem) {
            // �t���O����v�����肪�Ȃ�
            if (problem.length == 0) {
                res.send('{"status":"Invalid answer"}');
            }
            
            // ����
            User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
                // �����ꗗ��problem_id��ǉ�
                user.update({ provider: req.user.provider, provider_id: req.user.id },
                    { answered_problem: user.answered_problem + "," + problem[0].problem_id });
            });

            res.end('{"status":"ok"}');

        });

    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
