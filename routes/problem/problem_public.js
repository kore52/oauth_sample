var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../../');
    }

    var model = require('../../model');

    // �n�����problem_id�̖���ǂݍ���
    var Problem = model.Problem;

    Problem.find({ problem_id: req.params.problemId }, function(err, problem) {
        try {
            console.log(problem, req.params);
            if (problem.length < 1) throw "Problem not found.";
            if (problem.length > 1) throw "Problem data has duplicated.";
            res.render('problem_public', { problem: problem[0] });
        }
        catch (e) {
            res.status(503).send(e + '<pre>'+req+ '</pre>');
        }
    });
});

module.exports = router;
