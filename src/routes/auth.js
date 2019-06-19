import express from 'express';
import passport from 'passport';
import request from 'request';
import isAuthenticated from '../controllers/authController';
import { equal } from 'assert';

require('../controllers/authController');
require('dotenv').config();

const router = express.Router();

//Request for authentication using openidconnect strategy
router.get(
  '/',
  passport.authenticate('openidconnect', {
    scope: 'profile'
  })
);

//Fetch user information from OneLogin
router.use(
  '/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/');
  }
);

//Profile page for user info
router.use('/profile', (req, res) => {
  res.send('Profile<br/> ' + req.user.displayName);
});

// Destroy both the local session and
// revoke the access_token at OneLogin
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

export default router;
