var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('../');
  }

  res.render('./problem/crypto2', { title: 'à√çÜ2', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4) });
});

module.exports = router;
