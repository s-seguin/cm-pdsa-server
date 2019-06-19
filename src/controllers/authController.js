import passport from 'passport';
import OneLoginStrategy from 'passport-openidconnect';

require('dotenv').config();

// var OneLoginStrategy = openidconnect.Strategy;

const OIDC_BASE_URI = `https://criticalmass.onelogin.com/oidc`;

//Configure OpenIDConnect Strategy with the credentials from OneLogin
// export const configurePassport = (req, res) => {
passport.use(
  'openidconnect',
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
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      console.log('Callback function fired.');
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

export default function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
