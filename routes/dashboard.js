var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // 問題一覧を読み込み
    var Problem = model.Problem;
    var problems;
    Problem.find({}, function(err, p){
      problems = p;
    });
    
    // 回答状況を検索
    ////////////////////////////////////////////////////////////////
    // MongoDB初期化
    var User = model.User;
    var Score = model.Score;

    var condition = { provider: req.user.provider, provider_id: req.user.id };
    User.findOne(condition, function(err, user) {
        res.render('dashboard', { title: 'CTF Dashboard', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4), problems: problems, answered: user.answered_problem });
    });
});

module.exports = router;
