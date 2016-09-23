var mongoose = require('mongoose');
var mongodb_uri = process.env.MONGODB_URI || '';
mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);

module.exports.User = require('./models/User').User;
module.exports.Score = require('./models/Score').Score;
