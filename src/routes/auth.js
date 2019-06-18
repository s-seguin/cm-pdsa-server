import express from 'express';
import passport from 'passport';
const passportSetup = require('../controllers/authController');

const router = express.Router();

//OneLogin Auth
router.get(
  '/',
  passport.authenticate('openidconnect', {
    scope: 'profile'
  })
);

export default router;
