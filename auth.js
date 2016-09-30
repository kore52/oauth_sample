var ids = {
  github : {
    clientID : "e858816e383dc1a444fb",
    clientSecret : "8725ea28858065a8fc398ea5e0743e285bca1a6c",
    //callbackURL : "http://oauth-sample-001.herokuapp.com/auth/github/callback"
    callbackURL : process.env.OAUTH_GITHUB_CALLBACK_URI || "http://localhost:3000/auth/github/callback"
  },
  google : {
    clientID : "411708948435-jg78hpcd7f132d6e0vhb18cki1cmudg7.apps.googleusercontent.com",
    clientSecret : "AfWKGuN6tTl9lZ7rvCfL1z1P",
    callbackURL : "http://oauth-sample-001.herokuapp.com/auth/google/callback"
  }
}

module.exports = ids
