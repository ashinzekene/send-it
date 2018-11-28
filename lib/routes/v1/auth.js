import express from 'express';
import User from '../../models/user';
import { requireAuth, signJWT } from '../../utils/custom-auth';
import {
  sendResponse, sendError, comparePassword, hashPassword,
} from '../../utils/index';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  sendResponse(res, [{ token: req.token, user: res.user }]);
});

router.post('/signup', async (req, res) => {
  const password = await hashPassword(req.body.password);
  const params = {
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    othername: req.body.othername || '',
    email: req.body.email || '',
    registered: (new Date()),
    password,
    isAdmin: req.body.isAdmin ? 1 : 0,
  };
  const oldUser = User.getOne(req.body.email, 'email');
  if (oldUser) {
    sendError(res, { message: 'This account already exists' });
    return;
  }
  try {
    const user = await User.create(params);
    const token = signJWT(user.id, user.email, user.isadmin);
    sendResponse(res, [{ user, token }]);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.getOne(email, 'email');
  if (!user) {
    sendError(res, { message: 'User does not exist' }, false, 401);
    return;
  }
  const passwordCorrect = await comparePassword(password, user.password);
  if (passwordCorrect) {
    const token = signJWT(user.id, user.email, user.isadmin);
    sendResponse(res, [{ user, token }]);
  } else {
    sendError(res, { message: 'Password is incorrect' }, false, 401);
  }
});

router.get('/', requireAuth, async (req, res) => {
  sendResponse(res, [{ user: res.user }]);
});

export default router;
