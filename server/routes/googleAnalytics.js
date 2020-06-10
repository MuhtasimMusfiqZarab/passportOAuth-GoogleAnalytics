// will put the files of google analytics here (this is a new file for analytics data management)

//this is only used for creating a user object provided by google which we will sent to analytics for gettign the data
const { google } = require('googleapis');

//for accesing the token
const token = require('../services/passport');
const keys = require('../config/keys');

//trick: way to use app which is defined inside index.js (wrap the route handlers in this arrow function and export a function from this file)
module.exports = (app) => {
  //route for analytics
  app.get('/', async (req, res, next) => {
    //extract token from oAuth

    console.log('+++++++++++++++++++++++++++++++++++++++++++++');
    let _token = await token.getToken();

    console.log('Here is the token to see what type is it ?', _token);

    if (_token == undefined) {
      res.send('No Token');
    }

    //here is the authorization scope

    //getting new instance of authlient (here oAuthClient is initialized with an object, in this object we would put our keys)
    // let oAuthClient = auth.getOAuthClient();
    let oAuthClient = new google.auth.OAuth2(
      keys.googleClientID,
      keys.googleClientSecret,
      // '/auth/google/callback'
      'http://localhost:3000/auth/google/callback'
    );

    //it has got a token object after loggin
    try {
      //putting the access_tokens inside the oAuthClient object
      oAuthClient.setCredentials({
        //this are copy and pasted from token.json
        access_token:
          'ya29.a0AfH6SMCwjWyGpb71DpQX2GrgROprJrjvNwi1QwDT6Wqhz5SNr_hsE2pGxiNvvaF5pa0wbp98ZM6l-VcQutMpclwnODHtQgUp8S6rlUtSVf9Y0QZpwK6_WXtqItD_oM3t1S3FCTW0nNaYVJsrOjmpUl4l7RzvzuU3I5w',
        refresh_token:
          '1//0gkgDmFaOWsP6CgYIARAAGBASNwF-L9Ir8oWW02e9eNObutId4mnb7WzLLgZd-qy6TudGuVYdDazALlf8x0nz0WwCfR4qLN0BbYE',
      });

      console.log('++++Here is the oAuthClient++++', oAuthClient);
    } catch (err) {
      console.log(err);
    }

    //using V3 of the analytics API
    let analytics = google.analytics({
      version: 'v3',
      auth: oAuthClient, //API was used here for testing
      // auth: oAuthClient, //using object from the legecy code
      // auth: oAuthClient //auth client is your API key
    });

    try {
      //getting the account list
      let account_list = await analytics.management.accounts.list({});
      // res.send('Here is the account list after the oAuth flow', account_list);
      console.log('Here is all the account list', account_list);
      //sending the account_list when this route is visited
      res.send(account_list);
      console.log(account_list);
    } catch (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
    }
  });
};
