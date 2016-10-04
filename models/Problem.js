var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProblemSchema = new Schema({
  problem_id: { type: String },
  category: { type: String },
  subject: { type: String},
  description: { type: String },
  flag: { type: String },
  score: { type: Number },
  path: { type: String },
  sort: { type: Number }
});

module.exports.Problem = mongoose.model('Problem', ProblemSchema);
