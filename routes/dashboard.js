var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // âÒìöèÛãµÇåüçı
    ////////////////////////////////////////////////////////////////
    // MongoDBèâä˙âª
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
      provider: { type: String, required: true },
      provider_id: { type: String, required: true },
      nickname: { type: String },
      created: { type: Date, default: Date.now },
      updated: { type: Date, default: Date.now }
    });
    var ScoreSchema = new Schema({
      user_id: { type: String, required: true },
      problem_id: { type: String, required: true },
      score: { type: Number }
    });

    var mongodb_uri = process.env.MONGODB_URI || '';
    mongoose.model('User', UserSchema);
    mongoose.model('Score', ScoreSchema);
    mongoose.Promise = global.Promise;
    mongoose.connect(mongodb_uri);
    var User = mongoose.model('User');
    var Score = mongoose.model('Score');
    
    User.find({ provider: req.user.provider, provider_id: req.user.id }, function(err, user) {
      Score.find({ user_id: user._id }, function(err, scores) {
        res.render('dashboard', { title: 'CTF Dashboard', nickname: req.user.username, profile: JSON.stringify(req.user, null, 4), scores: scores });
      }
    }
  } else {
    res.redirect('../');
  }
});

module.exports = router;
