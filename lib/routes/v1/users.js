import express from 'express';
import User from '../../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.getAll();
  res.json(users);
});

export default router;
