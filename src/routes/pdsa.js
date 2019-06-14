import express from 'express';
import { newItem, findAll, newType, findAllType } from '../controllers/pdsaController';

const router = express.Router();

router.post('/new', newItem);

router.post('/new/type', newType);

router.get('/find/all', findAll);

router.get('/find/all/type', findAllType);

export default router;
