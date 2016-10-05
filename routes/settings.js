var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('settings', { title: '登録情報の変更', nickname: req.user.nickname, csrfToken: req.csrfToken() });
});

router.post('/', function(req, res){
  // ニックネームの変更
  console.log(req);
  console.log(req.profile);
  var profile = req.profile;
  
  var model = require('../model');
  var User = model.User;
  User.findOne({provider: profile.provider, provider_id: profile.profile.id}, function(err, user){
    if (err) return done(err);
    User.update({provider: profile.provider, provider_id: profile.profile.id}, {nickname: req.nickname}, function(err) {
      if (err) throw err;
      res.redirect('/dashboard');
    });
  });
});

module.exports = router;
