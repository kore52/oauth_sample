var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('pgconsole', { output: "" } );
});

router.post('/', function(req, res, next) {

    var pg = require('pg');
    var connectUri = 'postgres://ezrzhrxmxxlxoy:ZcZCltCwhhw5_2_j-LvsFL3CtD@ec2-54-163-239-28.compute-1.amazonaws.com:5432/d31svkp8aldqv1';
    var client = new pg.Client(connectUri);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to pgsql', err);
        }
        console.log(req.body.inputarea);
        client.query(req.body.inputarea, function(err, result) {
            var outputString;
            if(err) {
                outputString = 'error running query. ' + err;
            } else {
                outputString = result;
            }
            client.end();
            res.render('pgconsole', { output: outputString } );
        });
    });
});
module.exports = router;
