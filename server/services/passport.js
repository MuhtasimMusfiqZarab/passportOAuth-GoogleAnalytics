const passport = require('passport');

//instruct passport how to authenticate user with google oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
const keys = require('../config/keys');

//get access to the userModel
const User = mongoose.model('users');

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

//consoling the new instance of google strategy
const obj = new GoogleStrategy(
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
);

console.log('This is the google stratgy object', obj);
