var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  user_id: { type: String, required: true },
  problem_id: { type: String, required: true },
  score: { type: Number }
});
var mongodb_uri = process.env.MONGODB_URI || '';
mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);

exports.Score = mongoose.model('Score', ScoreSchema);
