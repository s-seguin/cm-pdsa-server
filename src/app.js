import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {
  indexRouter,
  bookRouter,
  skillAreaRouter,
  conferenceRouter,
  certificationRouter,
  courseSeminarRouter,
  otherRouter,
  subscriptionRouter,
  pdsaRouter
} from './routes/index';
import usersRouter from './routes/users';

import crudRouter from './routes/pdsaItemCrudRoutes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/skills', skillAreaRouter);

app.use('/pdsa/book', bookRouter);
app.use('/pdsa/conference', conferenceRouter);
app.use('/pdsa/certification', certificationRouter);
app.use('/pdsa/course-seminar', courseSeminarRouter);
app.use('/pdsa/other', otherRouter);
app.use('/pdsa/subscription', subscriptionRouter);
app.use('/pdsa', pdsaRouter);

app.use('/generic', crudRouter);

app.use('/', indexRouter);

export default app;
