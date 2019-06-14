import express from 'express';
import { newType, findAllTypes } from '../controllers/pdsaTypeController';

const router = express.Router();

router.post('/new', newType);

router.get('find/all', findAllTypes);

export default router;
