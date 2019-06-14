import express from 'express';
import { newType, findAllTypes } from '../controllers/pdsaTypeController';

const router = express.Router();

/**
 * Route to create a new PDSA Type. Logic implemented in controller.
 */
router.post('/new', newType);

/**
 * Route to return all of the PDSA types in the database
 */
router.get('find/all', findAllTypes);

export default router;
