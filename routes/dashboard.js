var express = require('express');
var router = express.Router();
var csurf = require('csurf');
router.use(csurf());
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    var Problem = model.Problem;
    Problem.find().sort({ sort: 1}).exec(function(err, problems) {

        var User = model.User;
        var condition = { provider: req.user.provider, provider_id: req.user.provider_id };

        User.findOne(condition, function(err, user) {
            if (err) throw err;

            if (user == null) res.redirect('/');
            var score = 0;
            for (var pid in user.answered_problem) {
                for (var i = 0; i < problems.length; i++)
                    if (pid == problems[i].problem_id)
                        score += problems[i].score;
            }

            var isAdmin = ('id' in user && user.id == 'ba78d5adde7b9102661039cd486146ba') ? true : false;
            res.render('dashboard', {
                title: 'ダッシュボード',
                nickname: user.nickname,
                profile: JSON.stringify(req.user, null, 4),
                problems: problems,
                answered: user.answered_problem,
                result: req.query.result,
                score: score,
                csrfToken: req.csrfToken(),
                isAdmin: isAdmin
            });
        });
    });
});

module.exports = router;
