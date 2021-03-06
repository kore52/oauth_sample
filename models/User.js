var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: { type: String, required: true },
  provider: { type: String, required: true },
  provider_id: { type: String, required: true },
  nickname: { type: String },
  answered_problem: { type: Schema.Types.Mixed },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

module.exports.User = mongoose.model('User', UserSchema);
