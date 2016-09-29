var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../../');
    }

    var model = require('../../model');

    // ìnÇ≥ÇÍÇÈproblem_idÇÃñ‚ëËÇì«Ç›çûÇ›
    var Problem = model.Problem;

    Problem.find({ problem_id: req.params.problemId }, function(err, problem) {
        try {
            console.log(problem);
            if (problem.length < 1) throw "Problem not found";
            if (problem.length > 1) throw "Problem data is duplicated";
            res.render('problem_public', { problem: problem[0] });
        }
        catch (e) {
            res.status(503).send(e);
        }
    });
});

module.exports = router;
