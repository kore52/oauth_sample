var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
//var globalTunnel = require('global-tunnel');
//globalTunnel.initialize();

var session = require('express-session');
var partials = require('express-partials');

// ページ遷移
var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');
var answer = require('./routes/answer');
var login = require('./routes/login');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(partials());
app.use(session({
  secret: 'the quick brown fox',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30*60*1000
  }
}));

////////////////////////////////////////////////////////////////
// セッションチェック
var sessionCheck = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

////////////////////////////////////////////////////////////////
// MongoDB初期化
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
//mongoose.model('User', UserSchema);
//mongoose.model('Score', ScoreSchema);
mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);
var User = mongoose.model('User');
var Score = mongoose.model('Score');

////////////////////////////////////////////////////////////////
// 認証処理
var authconfig = require('./auth.js');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


////////////////////////////////////////////////////////////////
// GitHubアカウントによるOAuth処理
var GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
    clientID: authconfig.github.clientID,
    clientSecret: authconfig.github.clientSecret,
    callbackURL: authconfig.github.callbackURL,
  },
  function(token, tokenSecret, profile, done) {
    User.find({provider: profile.provider, provider_id: profile.id}, function(err, docs){
      if (docs.length == 0) {
        var user = new User({ provider: profile.provider, provider_id: profile.id, nickname: profile.username });
        user.save(function(err) {
          if (err) { console.log(err); }
        });
      }
      if (err) {
        return done(err);
      }
      return done(null, profile);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    req.session.user = {name: req.body.username};
    res.redirect('/dashboard');
  }
);


app.use('/', routes);
app.use('/login', login);
app.use('/dashboard', sessionCheck, dashboard);
app.use('/answer', sessionCheck, answer);

var problem1 = require('./routes/problem/1');
app.use('/problem/1', sessionCheck, problem1);


app.get('/logout', function(req, res) {
  delete req.session.user;
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
