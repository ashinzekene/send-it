import express from 'express';
import auth from '../../utils/custom-auth';
import User from '../../models/user';
import utils from '../../utils/index';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const password = await utils.hashPassword(req.body.password);
  const params = {
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    othername: req.body.othername || '',
    email: req.body.email || '',
    registered: (new Date()),
    password,
    isAdmin: 0,
  };
  try {
    const user = await User.create(params);
    const token = auth.signJWT(user.id, user.email, user.isadmin);
    utils.sendResponse(res, [{ user, token }]);
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.getOne(email, 'email');
  const passwordCorrect = await utils.comparePassword(password, user.password);
  if (passwordCorrect) {
    const token = auth.signJWT(user.id, user.email, user.isadmin);
    utils.sendResponse(res, [{ user, token }]);
  } else {
    utils.sendError(res, { message: 'Password is incorrect' }, false, 401);
  }
});

router.get('/', auth.requireAuth, async (req, res) => {
  utils.sendResponse(res, [{ user: res.user }]);
});

export default router;
