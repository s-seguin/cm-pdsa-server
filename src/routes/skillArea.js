import express from 'express';
import {
  newPrimarySkill,
  newSecondarySkill,
  findAllPrimarySkills,
  findAllSecondarySkills
} from '../controllers/skillAreaController';

const router = express.Router();

router.post('/new/primary', newPrimarySkill);

router.post('/new/secondary', newSecondarySkill);

router.get('/find/primary/all', findAllPrimarySkills);

router.get('/find/secondary/all', findAllSecondarySkills);

export default router;
