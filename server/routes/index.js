// will put the files of google analytics here (this is a new file for analytics data management)

var express = require('express');
var router = express.Router();

//this is only used for creating a user object provided by google which we will sent to analytics for gettign the data
const { google } = require('googleapis');

//for accesing the token
const token = require('../services/passport');

/*-------------------------------- GET home page.-------------------------------- */
router.get('/', async (req, res, next) => {
  //extract token from oAuth
  let _token = await token.getToken();

  console.log('Here is the token to see what type is it ?', _token);

  if (_token == undefined) {
    res.send('No Token');
  }

  //getting new instance of authlient (here oAuthClient is initialized with an object, in this object we would put our keys)
  // let oAuthClient = auth.getOAuthClient();
  let oAuthClient = new google.auth.OAuth2(
    keys.googleClientID,
    keys.googleClientSecret,
    '/auth/google/callback'
  );

  //it has got a token object after loggin
  try {
    //putting the access_tokens inside the oAuthClient object
    oAuthClient.setCredentials(_token);
    console.log('Here is the oAuthClient', oAuthClient);
  } catch (err) {
    console.log(err);
  }

  //using V3 of the analytics API
  let analytics = google.analytics({
    version: 'v3',
    auth: oAuthClient, //auth client is your API key
  });

  try {
    //getting the account list
    let account_list = await analytics.management.accounts.list({});
    // res.send('Here is the account list after the oAuth flow', account_list);
    console.log('Here is all the account list', account_list);
  } catch (err) {
    if (err) {
      console.log(err);
      res.send(err);
    }
  }
});

module.exports = router;
