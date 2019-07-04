import express from 'express';
import passport from 'passport';
import OneLoginStrategy from 'passport-openidconnect';

require('dotenv').config();

const router = express.Router();
const http = require('http');

const OIDC_BASE_URI = `https://openid-connect.onelogin.com/oidc`;

/**
 * Setup Passport to create openidconnect strategy and setup callback function to create session and store user information.
 * Variable information is used from .env file.
 *
 * Setup methods to serialize and de-serialize the user object from/to session.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export function setupPassport() {
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
        scope: 'profile'
      },
      (issuer, sub, profile, jwtClaims, accessToken, refereshToken, tokenResponse, done) => {
        done(null, {
          // eslint-disable-next-line object-shorthand
          profile: profile,
          accessToken: {
            token: accessToken,
            scope: tokenResponse.scope,
            token_type: tokenResponse.token_type,
            expires_in: tokenResponse.expires_in
          },
          idToken: {
            token: tokenResponse.id_token,
            claims: jwtClaims
          }
        });
      }
    )
  );

  // Used to serialize user to session object
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to de-serialize user from session object
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
}

/**
 * Check if a user is authenticated with OneLogin and redirect to appropriate page.
 * Users that are not logged in will be sent to /login
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Object} next the next object
 */
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() && typeof req.user !== 'undefined') {
    return next();
  }
  return res.status(307).redirect('/auth/login');
}

/**
 * Check if the user is authenticated. If they are, log out the user from the OneLogin application
 * and remove the existing session.
 *
 * Method creates a POST request to `https://openid-connect.onelogin.com/oidc/token/revocation` by passing the
 * user access_token to revoke the token from all OneLogin applications.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export function logout(req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
  }

  // Setting the header for the POST request to OneLogin
  const options = {
    host: 'openid-connect.onelogin.com',
    path: '/oidc/token/revocation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: Buffer.from(
        `${process.env.OIDC_CLIENT_ID}:${process.env.OIDC_CLIENT_SECRET}`
      ).toString('base64')
    }
  };

  // Creating the request using options and handling the information returned from POST request
  const request = http.request(options, response => {
    let responseString = '';
    // Save all the data from the response
    response.on('data', data => {
      responseString += data;
    });
    // Log information from request when request is completed
    response.on('end', () => {
      console.log(`Logout POST Response String: ${responseString}`);
    });
  });
  // Create body information with access_token
  const requestBody = `token=${req.session.passport.user.accessToken.token}&token_type_hint=access_token`;
  // Submit the request
  request.write(requestBody);
  request.end();
  req.logout();
  res.status(200).send('Successfully Logged Out!');
}

export default router;
