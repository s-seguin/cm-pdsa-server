import express from 'express';
import {
  newSubscription,
  findAllSubscriptions
} from '../../controllers/types/subscriptionController';

const router = express.Router();

/**
 * Route to create a new subscription.
 */
router.post('/new', newSubscription);

/**
 * Route to return all of the subscriptions in the database.
 */
router.get('/find/all', findAllSubscriptions);

export default router;
