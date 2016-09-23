var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('./problem/1', { title: 'Problem 1', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4) });
  } else {
    res.redirect('../');
  }
});

module.exports = router;
