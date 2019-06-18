import express from 'express';

const router = express.Router();

//OneLogin Auth
router.get('/', (req, res) => {
  res.send('<h1>Login Page</h1>');
});

export default router;
