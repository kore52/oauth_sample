var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('settings', { title: '登録情報の変更' });
});

module.exports = router;
