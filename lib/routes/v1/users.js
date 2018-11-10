import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'You should get all users' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get a user by his/her ID' });
});

export default router;
