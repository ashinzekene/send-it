import express from 'express';
import User from '../../models/user';
import utils from '../../utils/index';
import auth from '../../utils/custom-auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    utils.handleError(err, res);
  }
});
router.get('/:user', async (req, res) => {
  try {
    const user = await User.getOne(req.params.user);
    res.json(user);
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
  const user = await User.create(params);
  const token = auth.signJWT(user.id, user.email, user.isAdmin);
  res.json({ ...user, token });
});

export default router;
