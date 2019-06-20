import express from 'express';

const router = express.Router();

/* GET home page. */
export const indexRouter = router.get('/*', (req, res) => {
  res.send('This is PDSA backend API.');
});

export { default as pdsaCrudRouter } from './pdsaItemCrudRoutes';
