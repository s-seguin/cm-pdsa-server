import express from 'express';
import {
  newCertification,
  findAllCertifications
} from '../../controllers/types/certificationController';

const router = express.Router();

/**
 * Route to create a new certification.
 */
router.post('/new', newCertification);

/**
 * Route to return all of the certifications in the database.
 */
router.get('/find/all', findAllCertifications);

export default router;
