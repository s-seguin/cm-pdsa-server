import express from 'express';
import {
  newPrimarySkill,
  newSecondarySkill,
  findAllPrimarySkills,
  findAllSecondarySkills
} from '../controllers/skillAreaController';

const router = express.Router();

/**
 * Route to create a new Primary Skill.
 */
router.post('/create/primary', newPrimarySkill);

/**
 * Route to create a new Secondary Skill.
 */
router.post('/create/secondary', newSecondarySkill);

/**
 * Route to return all of the Primary Skills in the database.
 */
router.get('/find/primary/all', findAllPrimarySkills);

/**
 * Route to return all of the Secondary Skills in the database.
 */
router.get('/find/secondary/all', findAllSecondarySkills);

export default router;
