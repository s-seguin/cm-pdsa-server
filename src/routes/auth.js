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

// Logout user and destroy OneLogin session.
router.get('/logout', logout);

// Fetch user information from OneLogin when callback function is triggered and user is logged in
router.get(
  '/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.status(200).redirect('/');
  }
);

// Fallback to login when invalid path is entered
router.get('/', (req, res) => {
  res.status(307).redirect('/auth/login');
});

export default router;
