import express from 'express';
import passport from 'passport';
import { setupPassport, logout } from '../controllers/authController';

require('https').globalAgent.options.rejectUnauthorized = false;
require('dotenv').config();

const request = require('request');
const router = express.Router();
var http = require('http');

//Initialize passport and create openidconnect strategy
setupPassport();

//Request for authentication using openidconnect strategy for OneLogin
router.get(
  '/login',
  passport.authenticate('openidconnect', {
    scope: 'profile'
  })
);

//Logout user and destroy OneLogin session.
router.get('/logout', logout);

//Fetch user information from OneLogin when callback function is triggered and user is logged in
router.get(
  '/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

export default router;
