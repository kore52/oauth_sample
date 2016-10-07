var express = require('express');
var router = express.Router();

router.get('/:problemId', function(req, res, next) {
    var model = require('../../model');

    // 渡されるproblem_idの問題を読み込み
    var Problem = model.Problem;
    Problem.findOne({ problem_id: req.params.problemId }, function(err, problem) {
        try {
            if (problem == null) throw "Problem not found.";
            res.render('problem_public', { problem: problem });
        }
        catch (e) {
            console.log(e);
            res.status(503).send(e);
        }
    });
});

router.post('/webapp1', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var md5sum = require('crypto').createHash('md5');
    md5sum.update(username + password);
    var digest = md5sum.digest('hex');
    if (digest == 'f12070c20cf77e9103b88f8cc3ac8f80') {
        res.render('problem/webapp1');
    } else {
        res.send('Invalid username or password.');
    }
});

router.post('/webapp2', function(req, res, next) {

    var pg = require('pg');
    var connectUri = 'postgres://ezrzhrxmxxlxoy:ZcZCltCwhhw5_2_j-LvsFL3CtD@ec2-54-163-239-28.compute-1.amazonaws.com:5432/d31svkp8aldqv1';
    var client = new pg.Client(connectUri);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to pgsql', err);
        }
        
        var user = (req.body.username == undefined) ? "" : req.body.username;
        var sql = "select username from userdb where username = '" + user + "' and password = md5('" + req.body.password + "');";
        
        
        // SELECT以外のコマンドをエラー扱い
        // INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, CREATE, CONNECT, TEMPORARY, EXECUTE, and USAGE.
        if ( sql.match(/insert/i)
          || sql.match(/update/i)
          || sql.match(/delete/i)
          || sql.match(/truncate/i)
          || sql.match(/references/i)
          || sql.match(/trigger/i)
          || sql.match(/create/i)
          || sql.match(/connect/i)
          || sql.match(/temporary/i)
          || sql.match(/execute/i)
          || sql.match(/usage/i)
          || sql.match(/alter/i)
          || sql.match(/revoke/i)
          || sql.match(/grant/i)
        ){
            res.send('Invalid query.');
        }
        
        client.query(sql, function(err, result) {
            client.end();

            var outputString;
            console.log(JSON.stringify(result));
            if(err || result.rows.length == 0) {
                return res.send('Invalid username or password.');
            } else {
                outputString = result;
            }
            
            var username = res.body.username;
            res.render('problem/webapp2', { output: outputString, username } );
        });
    });

});

module.exports = router;
