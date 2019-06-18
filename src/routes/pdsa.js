import express from 'express';
import { newItem, findAllItems } from '../controllers/pdsaItemController';

const router = express.Router();

/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/new', newItem);

/**
 * Route to return the entire list of PDSA items in the database. Logic handled by the controller.
 */
router.get('/find/all', findAllItems);

export default router;
