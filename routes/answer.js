var express = require('express');
var router = express.Router();

var model = require('../model');
var User = model.User;
var Problem = model.Problem;

router.post('/', function(req, res, next) {

    try {
        var postedAnswer = req.body.answerbox;

        Problem.findOne({ flag: postedAnswer }, function(err, problem) {
        
            console.log(postedAnswer);
            console.log("pro:"+problem);
            console.log("err:"+err);
            // ÉtÉâÉOÇ™àÍívÇ∑ÇÈñ‚ëËÇ™Ç»Ç¢
            if (problem == null || err) {
                return res.redirect('/dashboard?result=incorrect');
            }
            
            // ê≥â
            var condition = { provider: req.user.provider, provider_id: req.user.id };
            User.findOne(condition, function(err, user) {
                if (err) throw "user not found.";
                var answered_list = user.answered_problem;

                if (!(problem.problem_id in answered_list)) {
                    answered_list[problem.problem_id] = true;
                    var update = { answered_problem: answered_list, updated: new Date().toISOString() };
                    User.findOneAndUpdate(condition, update, {new: true}, function(err, user) {
                        if (err) throw "user not found.";
                    });
                }
            });
            

            res.redirect('/dashboard?result=correct');

        });

    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
