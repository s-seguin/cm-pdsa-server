import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/*', (req, res) => {
  res.send(
    "Only mock 'kitten' route currently working. <br> Please navigate to <b>localhost:3000/kitten</b> to see mock api"
  );
});

export default router;
