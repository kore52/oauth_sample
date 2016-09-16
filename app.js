var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
//var register = require('./routes/register');
var login = require('./routes/login');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'the quick brown fox',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30*60*1000
  }
}));

/*
var sessionCheck = function(req, res) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};
*/

////////////////////////////////////////////////////////////////
// ユーザーデータベース処理
var NeDB = require('nedb')
var db = {}
db.users = new NeDB({
  filename: 'usersfile'
});
db.users.loadDatabase();


////////////////////////////////////////////////////////////////
// OAuth処理
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////
// GitHubアカウントによるOAuth処理
var GITHUB_CLIENT_ID = "e858816e383dc1a444fb";
var GITHUB_CLIENT_SECRET = "8725ea28858065a8fc398ea5e0743e285bca1a6c";

var GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://oauth-sample-001.herokuapp.com/auth/github/callback",
  },
  function(token, tokenSecret, profile, done) {
    db.users.find({name: profile.username, provider: profile.provider}, function(err, docs){
      if (docs === []) {
        db.users.insert({name: profile.username, provider: profile.provider});
      }
    });
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


app.use('/', routes);
app.use('/login', login);

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
