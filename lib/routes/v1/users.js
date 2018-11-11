import express from 'express';
import User from '../../models/user';
import utils from '../../utils/index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    utils.sendResponse(res, users);
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.get('/:user', async (req, res) => {
  try {
    const user = await User.getOne(req.params.user);
    utils.sendResponse(res, [{ user }]);
  } catch (err) {
    utils.sendError(res, err);
  }
});

export default router;
