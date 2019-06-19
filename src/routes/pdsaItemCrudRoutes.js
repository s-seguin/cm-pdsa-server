import express from 'express';
import { create, find } from '../controllers/pdsaItemCrudController';

const router = express.Router();

/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/create/:type', create);

/**
 * The route to find the different PDSA items. Logic handled by controller.
 */
router.get('/find/all/:type', find);

export default router;
