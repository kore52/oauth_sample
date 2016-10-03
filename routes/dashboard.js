var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // ���ꗗ��ǂݍ���
    var Problem = model.Problem;
    var dicProblems = {};
    Problem.find().sort({program_id: 1}).exec(function(err, p) {
      for ( var i in p ) dicProblems[p[i].problem_id] = p[i];
    });

    // �񓚏󋵂�����
    ////////////////////////////////////////////////////////////////
    // MongoDB������
    var User = model.User;
    var Score = model.Score;

    var condition = { provider: req.user.provider, provider_id: req.user.id };
    User.findOne(condition, function(err, user) {
        var score = 0;
        for (var pid in user.answered_problem) {
            if (pid in dicProblems)
                score += dicProblems[pid].score;
        }
        
        res.render('dashboard', {
            title: 'CTF Dashboard',
            nickname: req.user.username,
            profile: JSON.stringify(req.user, null, 4),
            problems: dicProblems,
            answered: user.answered_problem,
            result: req.query.result,
            score: score
        });
    });
});

module.exports = router;
