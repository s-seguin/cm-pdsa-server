import express from 'express';
import { newItem, findAllItems } from '../controllers/pdsaItemController';
import { newBook, findAllBooks } from '../controllers/types/bookController';
import {
  newCertification,
  findAllCertifications
} from '../controllers/types/certificationController';
import { newConference, findAllConferences } from '../controllers/types/conferenceController';
import {
  newCourseSeminar,
  findAllCourseSeminars
} from '../controllers/types/courseSeminarController';
import { newOtherItem, findAllOtherItems } from '../controllers/types/otherController';
import { newSubscription, findAllSubscriptions } from '../controllers/types/subscriptionController';

const router = express.Router();

/**
 * The route to create a new PDSA item. Creation handled by controller.
 */
router.post('/new', newItem);

router.post('/book/new', newBook);

router.post('/certification/new', newCertification);

router.post('/conference/new', newConference);

router.post('/courseSeminar/new', newCourseSeminar);

router.post('/other/new', newOtherItem);

router.post('/subscription/new', newSubscription);

/**
 * Route to return the entire list of PDSA items in the database. Logic handled by the controller.
 */
router.get('/find/all', findAllItems);

router.get('/book/find/all', findAllBooks);

router.get('/certification/find/all', findAllCertifications);

router.get('/conference/find/all', findAllConferences);

router.get('/courseSeminar/find/all', findAllCourseSeminars);

router.get('/other/find/all', findAllOtherItems);

router.get('/subscription/find/all', findAllSubscriptions);

export default router;
