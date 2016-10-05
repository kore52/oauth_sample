var express = require('express');
var router = express.Router();

router.get('/:problemId', function(req, res, next) {
    var model = require('../../model');

    // 渡されるproblem_idの問題を読み込み
    var Problem = model.Problem;
    Problem.findOne({ problem_id: req.params.problemId }, function(err, problem) {
        try {
            if (problem == null) throw "Problem not found.";
            res.render('problem_public', { problem: problem });
        }
        catch (e) {
            console.log(e);
            res.status(503).send(e);
        }
    });
});

router.post('/webapp1', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == 'admin' && password == 'p@ssw0rd') {
        res.send('Flag is: STUPID_VALIDATION');
    } else {
        res.send('Invalid username or password.');
    }
});
module.exports = router;
