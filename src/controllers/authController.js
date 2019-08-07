import express from 'express';
import passport from 'passport';
import request from 'request';
import OneLoginStrategy from 'passport-openidconnect';

require('dotenv').config();

const router = express.Router();

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
        scope: 'profile',
        passReqToCallback: true
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
 * If user is not logged in, 401 Unauthorized is returned.
 * Will only allow requests that come from frontend application with a verified token.
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Object} next the next object
 */
export function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;

  request.post(
    {
      headers: { Authorization: token, 'Content-Type': 'application/x-www-form-urlencoded' },
      url: 'https://openid-connect.onelogin.com/oidc/me'
    },
    (body, response) => {
      if (response.statusCode === 200) {
        return next();
      }
      return res.status(401).send('Unauthorized Access.');
    }
  );
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
export function logout(req) {
  const reqToken = req.headers.authorization;
  request.post(
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.OIDC_CLIENT_ID}:${process.env.OIDC_CLIENT_SECRET}`
        ).toString('base64')}`
      },
      url: 'https://openid-connect.onelogin.com/oidc/token/revocation',
      body: `token=${reqToken}&token_type_hint=access_token`
    },
    (body, response, err) => {
      if (err !== null || err !== '') {
        return false;
      }
      return true;
    }
  );
}

export default router;
