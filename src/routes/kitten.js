import express from 'express';
import { newKitten, findAll, findByAge, findByName, rename } from '../controllers/kittenController';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send(
    'Welcome to kitten api.<br> Use <b>/new/kitten/name=:name&age=:age</b> to create a kitten <br>and <b>/find/kitten/name=:name</b> or <b>/find/kitten/age=:age</b> to retrieve kittens'
  );
});

/**
 * Create a new kitten, the url contains the age and name.
 */
router.get('/new/name=:name&age=:age', newKitten);

/**
 * Find a kitten by name provided in URL.
 */
router.get('/find/name=:name', findByName);

/**
 * Find a kitten by age provided in URL.
 */
router.get('/find/age=:age', findByAge);

/**
 * Return all kittens.
 */
router.get('/find/all', findAll);

/**
 * Rename a kitten - might not be working.
 */
router.get('/rename/oldName=:name&newName=:newName', rename);

export default router;
