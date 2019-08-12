import express from 'express';
import passport from 'passport';
import { setupPassport, logout } from '../controllers/authController';

require('https').globalAgent.options.rejectUnauthorized = false;
require('dotenv').config();

const router = express.Router();

// Initialize passport and create openidconnect strategy
setupPassport();

// Request for authentication using openidconnect strategy for OneLogin
router.get(
  '/login',
  passport.authenticate('openidconnect', {
    scope: 'profile'
  })
);

// Logout user from OneLogin and return necessary response to logout user.
router.post('/logout', (req, res) => {
  if (logout(req, res) === true) {
    res.status(200).send();
  }
  res.status(401).send();
});

// Fetch user information from OneLogin when callback function is triggered and user is logged in
router.get(
  '/callback',
  passport.authenticate('openidconnect', {
    callback: true,
    failureRedirect: '/auth/login'
  }),
  (req, res) => {
    res.redirect(
      `${
        req.headers.referer.includes(process.env.ONELOGIN_FRONTEND_REDIRECT_URL) &&
        process.env.ADMIN_USER_ACCESS.includes(req.user.idToken.claims._json.preferred_username)
          ? process.env.ONELOGIN_FRONTEND_REDIRECT_URL
          : process.env.ONELOGIN_FRONTEND_REDIRECT_URL_USER
      }/login/token/${req.user.accessToken.token}`
    );
  }
);

// Fallback to login when invalid path is entered
router.get('/', (req, res) => {
  res.status(307).redirect('/auth/login');
});

export default router;
