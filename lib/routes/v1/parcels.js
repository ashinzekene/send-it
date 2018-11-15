import express from 'express';
import Parcel from '../../models/parcel';
import auth from '../../utils/custom-auth';
import utils from '../../utils/index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const parcels = await Parcel.getAll();
    utils.sendResponse(res, parcels);
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.post('/', auth.requireAuth, async (req, res) => {
  const params = {
    placedBy: res.user.id,
    weight: req.body.weight,
    weightMetric: req.body.weightMetric || 'KG',
    sentOn: new Date(),
    status: 'placed',
    from: req.body.from,
    to: req.body.to,
    currentLocation: req.body.from,
  };
  try {
    const parcel = await Parcel.create(params);
    utils.sendResponse(res, [parcel]);
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const parcel = await Parcel.getOne(req.params.id);
    utils.sendResponse(res, [parcel]);
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.patch('/:parcel/destination', auth.allowOnlyOrderCreator, async (req, res) => {
  try {
    const parcels = await Parcel.updateDestination(req.body.destination, req.params.parcel);
    utils.sendResponse(res, [parcels]);
  } catch (err) {
    utils.sendError(res, err);
  }
});

export default router;
