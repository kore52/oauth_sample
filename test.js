var fs = require('fs');

var username='alice';

var buf = fs.readFileSync('./logfile');
var match = new RegExp('.*'+ username +'.*', 'gm');

var result = buf.toString().match(match);
console.log(result);
