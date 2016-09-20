var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('users', { title: 'CTF Dashboard', username: req.user.username, profile: JSON.stringify(req.user, null, 4) });
  } else {
    res.redirect('../');
  }
});

module.exports = router;
