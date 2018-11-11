import express from 'express';
import auth from '../../utils/custom-auth';
import User from '../../models/user';
import utils from '../../utils/index';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const params = {
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    othername: req.body.othername || '',
    email: req.body.email || '',
    registered: (new Date()),
    password: (new Date()),
    isAdmin: 0,
  };
  try {
    const user = await User.create(params);
    const token = auth.signJWT(user.id, user.email, user.isAdmin);
    utils.sendResponse(res, { ...user, token });
  } catch (err) {
    utils.sendError(res, err);
  }
});

export default router;
