import express from 'express';
import User from '../../models/user';
import Parcel from '../../models/parcel';
import { sendResponse, sendError } from '../../utils';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    sendResponse(res, users);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/:user', async (req, res) => {
  try {
    const user = await User.getOne(req.params.user);
    sendResponse(res, [{ user }]);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/:user/parcels', async (req, res) => {
  try {
    const parcels = await Parcel.getMany(req.params.user, 'placedby');
    sendResponse(res, parcels);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
