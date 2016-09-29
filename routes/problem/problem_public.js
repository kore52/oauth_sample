var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../../');
    }

    var model = require('../../model');

    // 渡されるproblem_idの問題を読み込み
    var Problem = model.Problem;

    Problem.find({ problem_id: req.params.problemId }, function(err, problem) {
        res.render('problem_public', { problem: problem });
    });
});

module.exports = router;
