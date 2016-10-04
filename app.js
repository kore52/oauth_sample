var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
//var globalTunnel = require('global-tunnel');
//globalTunnel.initialize();

var session = require('express-session');
var partials = require('express-partials');



////////////////////////////////////////////////////////////////
// MongoDB初期化
var model = require('./model');
var User = model.User;
var Score = model.Score;



// ページ遷移
var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');
var answer = require('./routes/answer');
var login = require('./routes/login');
var settings = require('./routes/settings');

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
// 認証処理
var authconfig = require('./auth.js');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
      if (err) return done(err);
      if (user) return done(null, user);
      var user = new User({ provider: profile.provider, provider_id: profile.id, nickname: profile.username||"no name", answered_problem: {"dummy":true} });
      user.save(function(err) {
        if (err) throw err;
      });
      return done(null, profile);
    });
  })
);

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    req.session.user = {name: req.body.username};
    res.redirect('/dashboard');
  }
);

////////////////////////////////////////////////////////////////
// TwitterアカウントによるOAuth処理
var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
    consumerKey: authconfig.twitter.consumerKey,
    consumerSecret: authconfig.twitter.consumerSecret,
    callbackURL: authconfig.twitter.callbackURL,
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({provider: profile.provider, provider_id: profile.id}, function(err, user){
      if (err) return done(err);
      if (user) return done(null, user);
      var user = new User({ provider: profile.provider, provider_id: profile.id, nickname: profile.username||"no name", answered_problem: {"dummy":true} });
      user.save(function(err) {
        if (err) throw err;
      });
      return done(null, profile);
    });
  })
);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
  function (req, res) {
    req.session.user = {name: req.body.username};
    res.redirect('/dashboard');
  }
);
app.post('/dashboard', function(req, res){
  // ニックネームの変更
  console.log(req);
  console.log(req.profile);
  var profile = req.profile;
  User.findOne({provider: profile.provider, provider_id: profile.profile.id}, function(err, user)){
    if (err) return done(err);
    User.update({provider: profile.provider, provider_id: profile.profile.id}, {nickname: req.nickname}, function(err)) {
      if (err) throw err;
      res.redirect('/dashboard');
    }
  });
});

////////////////////////////////////////////////////////////////
// GoogleアカウントによるOAuth処理
var GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
    clientID: authconfig.google.clientID,
    clientSecret: authconfig.google.clientSecret,
    callbackURL: authconfig.google.callbackURL,
  },
  function(token, tokenSecret, profile, done) {
    User.find({provider: profile.provider, provider_id: profile.id}, function(err, docs){
      if (err) return done(err);
      if (user) return done(null, user);
      var user = new User({ provider: profile.provider, provider_id: profile.id, nickname: profile.username||"no name", answered_problem: {"dummy":true} });
      user.save(function(err) {
        if (err) throw err;
      });
      return done(null, profile);
    });
  })
);
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    req.session.user = {name: req.body.username};
    res.redirect('/dashboard');
  }
);

///////////////////////////////////////
app.use('/', routes);
app.use('/login', login);
app.use('/dashboard', sessionCheck, dashboard);
app.use('/answer', sessionCheck, answer);
app.use('/settings', sessionCheck, settings);

var problem = require('./routes/problem/problem_public');
app.use('/problem', sessionCheck, problem);


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
