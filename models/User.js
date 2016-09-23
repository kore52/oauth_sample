var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  provider: { type: String, required: true },
  provider_id: { type: String, required: true },
  nickname: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});
var mongodb_uri = process.env.MONGODB_URI || '';
mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);

exports.User = mongoose.model('User', UserSchema);
