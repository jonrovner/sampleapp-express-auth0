var qs = require('querystring');
var express = require('express');
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');


passport.use(new OpenIDConnectStrategy({
  issuer: 'https://' + process.env['AUTH0_DOMAIN'] + '/',
  authorizationURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/authorize',
  tokenURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/oauth/token',
  userInfoURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/userinfo',
  clientID: process.env['AUTH0_CLIENT_ID'],
  clientSecret: process.env['AUTH0_CLIENT_SECRET'],
  callbackURL: 'https://charliessampleapplication.herokuapp.com/oauth2/redirect',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

router.get('/oauth2/redirect', passport.authenticate('openidconnect', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout();
  var params = {
    client_id: process.env['AUTH0_CLIENT_ID'],
    returnTo: 'https://charliessampleapplication.herokuapp.com'
  };
  res.redirect('https://' + process.env['AUTH0_DOMAIN'] + '/v2/logout?' + qs.stringify(params));
});

module.exports = router;
