import passport from 'passport';
import OneLoginStrategy from 'passport-openidconnect';
import session from 'express-session';

require('dotenv').config();

// var OneLoginStrategy = openidconnect.Strategy;

const OIDC_BASE_URI = `https://criticalmass.onelogin.com/oidc`;

//Configure OpenIDConnect Strategy with the credentials from OneLogin
// export const configurePassport = (req, res) => {
passport.use(
  new OneLoginStrategy(
    {
      issuer: OIDC_BASE_URI,
      clientID: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorizationURL: `${OIDC_BASE_URI}/auth`,
      userInfoURL: `${OIDC_BASE_URI}/me`,
      tokenURL: `${OIDC_BASE_URI}/token`,
      callbackURL: process.env.OIDC_REDIRECT_URI,
      passReqToCallback: true
    },
    function(req, issuer, userId, profile, accessToken, refreshToken, params, cb) {
      console.log('issuer:', issuer);
      console.log('userId:', userId);
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      console.log('params:', params);

      req.session.accessToken = accessToken;

      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
