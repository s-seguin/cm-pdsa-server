import express from 'express';
import { newKitten, findAll, findByAge, findByName, rename } from '../controllers/kittenController';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send(
    'Welcome to kitten api.<br> Use <b>/new/kitten/name=:name&age=:age</b> to create a kitten <br>and <b>/find/kitten/name=:name</b> or <b>/find/kitten/age=:age</b> to retrieve kittens'
  );
});

router.get('/new/name=:name&age=:age', newKitten);

router.get('/find/name=:name', findByName);

router.get('/find/age=:age', findByAge);

router.get('/find/all', findAll);

router.get('/rename/oldName=:name&newName=:newName', rename);

export default router;
