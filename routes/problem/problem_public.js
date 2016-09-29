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
            if (problem.length == 1) {
                res.render('problem_public', { problem: problem[0] });
            } else {
                throw "Problem not found";
            }
        } catch (e) {
            res.send(e, false);
        }
    });
});

module.exports = router;
