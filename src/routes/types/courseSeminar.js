import express from 'express';
import {
  newCourseSeminar,
  findAllCourseSeminars
} from '../../controllers/types/courseSeminarController';

const router = express.Router();

/**
 * Route to create a new certification.
 */
router.post('/new', newCourseSeminar);

/**
 * Route to return all of the certifications in the database.
 */
router.get('/find/all', findAllCourseSeminars);

export default router;
