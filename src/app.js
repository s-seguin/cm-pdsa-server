import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import pdsaRouter from './routes/pdsa';
import pdsaTypeRouter from './routes/pdsaType';
import skillAreaRouter from './routes/skillArea';
import authRouter from './routes/auth';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setup session for passport and OneLogin authentication
app.use(
  session({
    secret: 'secret squirrel',
    resave: false,
    saveUninitialized: true
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/skills', skillAreaRouter);
app.use('/pdsa/type', pdsaTypeRouter);
app.use('/pdsa', pdsaRouter);
app.use('/login', authRouter);

app.use('/', indexRouter);

export default app;
