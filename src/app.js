import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';

import usersRouter from './routes/users';
import authRouter from './routes/auth';
import { isAuthenticated } from './controllers/authController';
import { indexRouter, pdsaCrudRouter, metadataCrudRouter } from './routes/index';

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup session for passport and OneLogin authentication
app.use(
  session({
    secret: 'fat cats eating giant shrimp',
    resave: false,
    saveUninitialized: true
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Allows CORS to only pass through certain domain requests
app.use(
  cors({
    origin: process.env.ONELOGIN_FRONTEND_REDIRECT_URL
  })
);

app.use('/users', isAuthenticated, usersRouter);

// Authorization Routes
app.use('/auth', authRouter);
app.use('/login', authRouter);

app.use('/pdsa', isAuthenticated, pdsaCrudRouter);
app.use('/metadata', isAuthenticated, metadataCrudRouter);

app.use('/', indexRouter);

export default app;
