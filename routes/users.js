var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var html = "mmm";
  if (req.isAuthenticated()) {
    var html = "authenticated!";
    html += "<p>authenticated as user:</p>";
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
  }
  res.send(html);
});

module.exports = router;
