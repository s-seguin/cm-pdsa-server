import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import kittenRouter from './routes/kitten';
import pdsaRouter from './routes/pdsa';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/kitten', kittenRouter);
app.use('/users', usersRouter);
app.use('/pdsa', pdsaRouter);
app.use('/', indexRouter);

export default app;
