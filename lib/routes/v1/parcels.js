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

router.patch('/:parcel/destination', auth.requireAuth, auth.allowOnlyParcelCreator, async (req, res) => {
  try {
    const parcel = await Parcel.updateDestination(req.body.to, req.params.parcel);
    const { id, to } = parcel;
    utils.sendResponse(res, { message: 'Parcel destination updated', id, to });
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.patch('/:parcel/status', auth.requireAuth, auth.allowOnlyAdmins, async (req, res) => {
  try {
    const parcel = await Parcel.updateStatus(req.body.status, req.params.parcel);
    const { id, status } = parcel;
    utils.sendResponse(res, { message: 'Parcel status updated', id, status });
  } catch (err) {
    utils.sendError(res, err);
  }
});

router.patch('/:parcel/currentlocation', auth.requireAuth, auth.allowOnlyAdmins, async (req, res) => {
  try {
    const parcel = await Parcel.updateCurrentLocation(req.body.currentlocation, req.params.parcel);
    const { id, currentlocation } = parcel;
    utils.sendResponse(res, { message: 'Parcel location updated', id, currentlocation });
  } catch (err) {
    utils.sendError(res, err);
  }
});

export default router;
