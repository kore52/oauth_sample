var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('../');
  }

  res.render('./problem/crypto1', { title: '�V�[�U�[�Í�', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4) });
});

module.exports = router;