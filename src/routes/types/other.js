import express from 'express';
import { newOtherItem, findAllOtherItems } from '../../controllers/types/otherController';

const router = express.Router();

/**
 * Route to create a new other pdsa item.
 */
router.post('/new', newOtherItem);

/**
 * Route to return all of the other pdsa items in the database.
 */
router.get('/find/all', findAllOtherItems);

export default router;
