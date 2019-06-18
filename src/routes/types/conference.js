import express from 'express';
import { newConference, findAllConferences } from '../../controllers/types/conferenceController';

const router = express.Router();

/**
 * Route to create a new conference.
 */
router.post('/new', newConference);

/**
 * Route to return all of the conference in the database.
 */
router.get('/find/all', findAllConferences);

export default router;
