const passport = require('passport');

//trick: way to use app which is defined inside index.js (wrap the route handlers in this arrow function and export a function from this file)
module.exports = (app) => {
  //route handler that make sure that user gets kicked to the passport flow
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  //route handler when user visits to the redirected URL
  //turn the code from URL to actual user profile
  //passport.authenticalte(google) is a middleware
  //request is sent to after this middleware is executed
  // this 3rd arg redirects the user when we visits the route from the client
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  //loggin out the user
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  //show the current user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
