const passport = require('passport');

// pointing to token.json (these three)
const fs = require('fs');
const path = require('path');
const tokenPath = path.join(__dirname, 'token.json');

//instruct passport how to authenticate user with google oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
const keys = require('../config/keys');

//get access to the userModel
const User = mongoose.model('users');

//-------------------------------Managing the token from Passport-----------------

function saveToken(token) {
  var _token = {
    token: token,
  };
  try {
    fs.writeFileSync(tokenPath, JSON.stringify(_token));
    console.log('Token Saved');
    return fs.readFileSync(tokenPath);
  } catch (err) {
    console.log('------------ Could Not Save Token ------------------');
    console.log(err);
  }
}

//main code for gettign the token
function getToken() {
  try {
    // fs.writeFileSync(tokenPath, JSON.stringify(_token));
    let token = fs.readFileSync(tokenPath);
    token = JSON.parse(token);
    console.log('I have got the token man', token);
    return token.token;
  } catch (err) {
    console.log('------------ Could Not get Token ------------------');
    console.log(err);
  }
}

function deleteToken() {
  fs.writeFileSync(tokenPath, JSON.stringify({}));
  return fs.readFileSync(tokenPath);
}

//-------------------------Token Management ends here ---------------------------------

//this creates some token for upcomming followup requests
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//take the id from cookie to turn it into the  userModel
passport.deserializeUser((id, done) => {
  //find the user from the DB
  User.findById(id).then((user) => done(null, user));
});

//help passport to understant how to use google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      //the route the user will be send to after permission is granted (this URI and the provided URI inside the cloud console must be same )
      callbackURL: '/auth/google/callback',
      // for going from one url to other for development purposes
      proxy: true,
    },
    // we are redicted from the google flow and this runs
    async (accessToken, refreshToken, profile, done) => {
      //show data from google
      console.log('This is accessToken', accessToken);
      console.log('This is refreshToken', refreshToken);
      console.log('This is profile', profile);

      //save the token to a file for future use if needed
      saveToken({
        access_token: accessToken,
        refresh_token: refreshToken,
        //dont know if it is necessary or not
        RedirectionUrl: '/auth/google/callback',
      });

      //check if the user already is created in the DB
      const existingUser = await User.findOne({ googleID: profile.id });
      if (existingUser) {
        console.log(existingUser);
        return done(null, existingUser);
      }
      //create new model instance & save it to datrabase
      const user = await new User({ googleID: profile.id }).save();
      //we are done with athentication flow
      done(null, user);
    }
  )
);

//------------------exporting only the token management functions--------------
module.exports = {
  saveToken: saveToken,
  getToken: getToken,
  deleteToken: deleteToken,
};
