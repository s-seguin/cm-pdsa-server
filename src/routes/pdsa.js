import express from 'express';
import { newItem, findAllItems } from '../controllers/pdsaItemController';

const router = express.Router();

router.post('/new', newItem);

router.get('/find/all', findAllItems);

export default router;
