const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');

//help express to handle cookies
const cookieSession = require('cookie-session');

//tell passport to keep track of the user's session
const passport = require('passport');

//user model is created
require('./models/User');
//put newly created user model inside this file
require('./services/passport');

//connect to mongoDB using mongoose
mongoose.connect(keys.mongoURI);

//------------------------------middlewares--------------------------------

const app = express();

//tell express that it needs to use cookies inside of the application
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

//authRoute is a function that takes the app and attaches these two routes to it
require('./routes/authRoutes')(app);

//listen to ports
const PORT = process.env.PORT || 5000;
app.listen(PORT);
