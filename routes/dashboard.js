var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('../');
    }

    var model = require('../model');

    // –â‘èˆê——‚ğ“Ç‚İ‚İ
    var Problem = model.Problem;
    var problems;
    Problem.find({}, function(err, p){
      problems = p;
    });
    
    // ‰ñ“šó‹µ‚ğŒŸõ
    ////////////////////////////////////////////////////////////////
    // MongoDB‰Šú‰»
    var User = model.User;
    var Score = model.Score;

    User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, users) {
        var user = users[0];
        console.log(user);
        var answered = {}
        user.answered_problem.split(',').every(function(p) {
            answered[p] = true;
        });
        
        res.render('dashboard', { title: 'CTF Dashboard', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4), problems: problems, answered: answered });
    });
});

module.exports = router;
