var fs = require('fs');

var buf = fs.readFileSync('./logfile')
console.log(buf)