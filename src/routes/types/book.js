import express from 'express';
import { newBook, findAllBooks } from '../../controllers/types/bookController';

const router = express.Router();

/**
 * Route to create a new Book.
 */
router.post('/new', newBook);

/**
 * Route to return all of the books in the database.
 */
router.get('/find/all', findAllBooks);

export default router;
