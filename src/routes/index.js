import express from 'express';

const router = express.Router();

/* GET home page. */
export const indexRouter = router.get('/*', (req, res) => {
  res.send('This is PDSA backend API.');
});

export { default as bookRouter } from './types/book';
export { default as certificationRouter } from './types/certification';
export { default as conferenceRouter } from './types/conference';
export { default as courseSeminarRouter } from './types/conference';
export { default as otherRouter } from './types/other';
export { default as subscriptionRouter } from './types/subscription';
export { default as skillAreaRouter } from './skillArea';
export { default as pdsaRouter } from './pdsa';
