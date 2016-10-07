var express = require('express');
var router = express.Router();

router.get('/', function(res, req, next) {
  res.send(JSON.stringify({
    "apiversion": "1.0",
    "status": "OK",
    "flag": "PEEKING_YOUR_RESPONSE" }));
});

module.exports = router;
