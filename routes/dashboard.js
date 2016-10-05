var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // 問題一覧を読み込み
    var Problem = model.Problem;
    Problem.find().sort({ sort: 1}).exec(function(err, problems) {

        // 回答状況を検索
        var User = model.User;
        var condition;
        console.log("req.user=", req.user);
        if (req.user.provider == 'google' || req.user.provider == 'github')
          condition = { provider: req.user.provider, provider_id: req.user.id };
        else if (req.user.provider == 'twitter')
          condition = { provider: req.user.provider, provider_id: req.user.provider_id };
        console.log("condition=", condition);
        User.findOne(condition, function(err, user) {
            if (err) throw err;
            if (user == null) throw "User not found.";
            var score = 0;
            for (var pid in user.answered_problem) {
                for (var i = 0; i < problems.length; i++)
                    if (pid == problems[i].problem_id)
                        score += problems[i].score;
            }

            res.render('dashboard', {
                title: 'ダッシュボード',
                nickname: user.nickname,
                profile: JSON.stringify(req.user, null, 4),
                problems: problems,
                answered: user.answered_problem,
                result: req.query.result,
                score: score
            });
        });
    });
});


module.exports = router;
