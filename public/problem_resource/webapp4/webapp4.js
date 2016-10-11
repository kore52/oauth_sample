var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.render('problem/webapp4');
});

router.post('/', function(req, res, next) {

    var username='alice';
    var query = (req.body.query != null) ? req.body.query : "";
    
    try {
        var buf = fs.readFileSync('./logfile');
        var match = new RegExp('(.*user=' + username + ' .*' + query + '.*)', 'gm');
        var result = buf.toString().match(match);

        res.send({result});
    } catch(e) {
        console.log(e);
        res.send(e);
    }
});

module.exports = router;
