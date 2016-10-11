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
        var buf = readFile();
        var match = new RegExp('(.*user=' + username + ' .*' + query + '.*)', 'gm');
        var result = buf.toString().match(match);

        res.send({result});
    } catch(e) {
        console.log(e);
        res.send(e);
    }
});

function readFile() {
    var buffer = ["user=bob date=[Apr 01 09:30:11 -0500] func=login,\
user=bob date=[Apr 01 09:30:11 -0500] func=login status=success,\
user=bob date=[Apr 01 09:31:07 -0500] func=search,\
user=bob date=[Apr 01 09:31:35 -0500] func=search,\
user=bob date=[Apr 01 09:32:01 -0500] func=search,\
user=bob date=[Apr 01 09:32:09 -0500] func=detail code=AN1000084785,\
user=bob date=[Apr 01 09:32:09 -0500] func=detail code=AN1000084874,\
user=alice date=[Apr 01 09:33:11 -0500] func=search,\
user=alice date=[Apr 01 09:34:10 -0500] func=search,\
user=alice date=[Apr 01 09:34:26 -0500] func=login,\
user=alice date=[Apr 01 09:34:26 -0500] func=login status=success,\
user=alice date=[Apr 01 09:34:58 -0500] func=detail code=AN1000114787,\
user=bob date=[Apr 01 09:34:58 -0500] func=detail code=AN1000035885,\
user=bob date=[Apr 01 09:38:30 -0500] func=addcart code=AN1000035885,\
user=bob date=[Apr 01 09:40:12 -0500] func=payment method=PAYPAL,\
user=bob date=[Apr 01 09:43:49 -0500] func=confirm,\
user=bob date=[Apr 01 09:45:14 -0500] func=order order_no=1495785235,\
user=carol date=[Apr 01 09:45:51 -0500] func=login,\
user=carol date=[Apr 01 09:45:51 -0500] func=login status=success,\
user=alice date=[Apr 01 09:46:56 -0500] func=search,\
user=carol date=[Apr 01 09:46:56 -0500] func=search,\
user=alice date=[Apr 01 09:51:14 -0500] func=search,\
user=alice date=[Apr 01 10:22:42 -0500] func=detail code=AN1000114789,\
user=alice date=[Apr 01 10:25:34 -0500] func=addcart code=AN1000114789 amount=1,\
user=alice date=[Apr 01 10:32:50 -0500] func=payment method=AMEX,\
user=alice date=[Apr 01 10:33:07 -0500] func=confirm,\
user=alice date=[Apr 01 10:35:12 -0500] func=order order_no=1495785236,\
user=charlie date=[Apr 01 12:47:02 -0500] func=login,\
user=charlie date=[Apr 01 12:47:02 -0500] func=login status=failure,\
user=charlie date=[Apr 01 12:48:05 -0500] func=login,\
user=charlie date=[Apr 01 12:48:05 -0500] func=login status=failure,\
user=bob date=[Apr 01 12:48:17 -0500] FL@G: INVASION_OF_PRIVACY,\
user=charlie date=[Apr 01 12:48:25 -0500] func=login,\
user=charlie date=[Apr 01 12:48:25 -0500] func=login status=success,\
user=charlie date=[Apr 01 12:52:10 -0500] func=search,\
user=charlie date=[Apr 01 12:52:18 -0500] func=search,\
user=charlie date=[Apr 01 12:52:25 -0500] func=search,\
user=charlie date=[Apr 01 12:52:37 -0500] func=search,\
user=charlie date=[Apr 01 12:52:50 -0500] func=search,\
user=bob date=[Apr 01 18:00:00 -0500] session timed out"
    ]
    return buffer
}

module.exports = router;
