import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import pdsaRouter from './routes/pdsa';
import pdsaBookRouter from './routes/types/book';
import pdsaCertificationRouter from './routes/types/certification';
import pdsaConferenceRouter from './routes/types/conference';
import pdsaCourseSeminarRouter from './routes/types/courseSeminar';
import pdsaOtherRouter from './routes/types/other';
import pdsaSubscription from './routes/types/subscription';
import skillAreaRouter from './routes/skillArea';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/skills', skillAreaRouter);

app.use('/pdsa/book', pdsaBookRouter);
app.use('/pdsa/conference', pdsaConferenceRouter);
app.use('/pdsa/certification', pdsaCertificationRouter);
app.use('/pdsa/course-seminar', pdsaCourseSeminarRouter);
app.use('/pdsa/other', pdsaOtherRouter);
app.use('/pdsa/subscription', pdsaSubscription);
app.use('/pdsa', pdsaRouter);

app.use('/', indexRouter);

export default app;
