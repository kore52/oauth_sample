var express = require('express');
var router = express.Router();

router.get('/webapp3/api/add', function(req, res, next) {

    try {
        var a = ("a" in req.query) ? parseInt(req.query.a) : 0;
        var b = ("b" in req.query) ? parseInt(req.query.b) : 0;

        if (String(a) != req.query.a) throw "something"
        if (String(b) != req.query.b) throw "something"
        
        res.setHeader('content-type', 'application/json');

        res.send(JSON.stringify({
            "apiversion": "1.0",
            "status": "OK",
            "result": a + b,
            "flag": "YOU_CAN_PEEK_HTTP_RESPONSE" }));

    } catch(e) {
        res.send(JSON.stringify({
            "apiversion": "1.0",
            "status": "Fail",
            "result": "HINT: press F12 key to see http response...",
            "flag": "YOU_CAN_PEEK_HTTP_RESPONSE" }));
    }
});

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
    var client = new pg.Client(POSTGRES_URI);
    client.connect(function(err) {
        if (err) {
            return res.send('could not connect to pgsql', err);
        }
        
        var user = ("username" in req.body) ? req.body.username : "";
        var pass = ("password" in req.body) ? req.body.password : "";
        var sql = "select username from userdb where username = '" + user + "' and password = md5('" + pass + "');";
        
        
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
            return res.send('Invalid query.');
        }
        
        client.query(sql, function(err, result) {
            client.end();

            if (err) return res.send(err);
            if (result.rows.length == 0) return res.send('Invalid username or password.');

            var outputString = result;
            var username = user;
            res.render('problem/webapp2', { output: outputString, username } );
        });
    });

});

module.exports = router;
