var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // –â‘èˆê——‚ğ“Ç‚İ‚İ
    var Problem = model.Problem;
    Problem.find().sort({ sort: 1}).exec(function(err, problems) {

        // ‰ñ“šó‹µ‚ğŒŸõ
        var User = model.User;
        var condition = { provider: req.user.provider, provider_id: req.user.id };
        User.findOne(condition, function(err, user) {
            var score = 0;
            for (var pid in user.answered_problem) {
                for (var i = 0; i < problems.length; i++)
                    if (pid == problems[i].problem_id)
                        score += problems[i].score;
            }

            res.render('dashboard', {
                title: 'CTF Dashboard',
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
