var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  user_id: { type: String, required: true },
  problem_id: { type: String, required: true },
  score: { type: Number }
});

module.exports.Score = mongoose.model('Score', ScoreSchema);
