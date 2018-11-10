import express from 'express';
import User from '../../models/user';
import utils from '../../utils/index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    utils.handleError(err, res);
  }
});

router.post('/', async (req, res) => {
  const params = {
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    othername: req.body.othername || '',
    email: req.body.email || '',
    registered: (new Date()),
    isAdmin: 0,
  };
  const users = await User.create(params);
  res.json(users);
});

export default router;
