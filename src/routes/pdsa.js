import express from 'express';
import { newItem, findAllItems } from '../controllers/pdsaItemController';
import { newBook, findAllBooks } from '../controllers/bookController';
import { newCertification, findAllCertifications } from '../controllers/certificationController';

const router = express.Router();

/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/new', newItem);

router.post('/book/new', newBook);

router.post('/certification/new', newCertification);

/**
 * Route to return the entire list of PDSA items in the database. Logic handled by the controller.
 */
router.get('/find/all', findAllItems);

router.get('/book/find/all', findAllBooks);

router.get('/certification/find/all', findAllCertifications);

export default router;
