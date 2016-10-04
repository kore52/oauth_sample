var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // 問題一覧を読み込み
    var Problem = model.Problem;
    var dicProblems = {};
    Problem.find().sort({program_id: 1}).exec(function(err, p) {
      for ( var i in p ) dicProblems[p[i].problem_id] = p[i];
    });

    // 回答状況を検索
    ////////////////////////////////////////////////////////////////
    // MongoDB初期化
    var User = model.User;
    var Score = model.Score;

    var condition = { provider: req.user.provider, provider_id: req.user.id };
    User.findOne(condition, function(err, user) {
        var score = 0;
        for (var pid in user.answered_problem) {
            if (pid in dicProblems)
                score += dicProblems[pid].score;
        }

        object_array_sort(dicProblems, 'program_id', 'asc', function(sorted_data) {
            res.render('dashboard', {
                title: 'CTF Dashboard',
                nickname: user.nickname,
                profile: JSON.stringify(req.user, null, 4),
                problems: sorted_data,
                answered: user.answered_problem,
                result: req.query.result,
                score: score
            });
        });
    });
});

//
// 連想配列をkeyでソートする
// order == 'asc' or 'desc'
//
function object_array_sort(data, key, order, func) {
    var num_a = 1;
    var num_b = -1;
    
    if (order == 'desc') {
      num_a = -1;
      num_b = 1;
    }
    
    data = data.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      if (x > y) return num_a;
      if (x < y) return num_b;
      return 0;
    });
  
    func(data);
}

module.exports = router;
