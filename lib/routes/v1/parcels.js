import express from 'express';
import Parcel from '../../models/parcel';
import { sendResponse, sendError } from '../../utils';
import {
  requireAuth, allowOnlyAdmins, allowOnlyParcelCreator,
  orderNotDelivered, isUserParcelCreator, isUserAdmin,
} from '../../utils/custom-auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const parcels = await Parcel.getAll();
    sendResponse(res, parcels);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/', requireAuth, async (req, res) => {
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
    sendResponse(res, [parcel]);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/:parcel', async (req, res) => {
  try {
    if (isUserAdmin(req) || isUserParcelCreator(req)) {
      const parcel = await Parcel.getOneWithUser(req.params.parcel);
      sendResponse(res, [parcel]);
    } else {
      const parcel = await Parcel.getOne(req.params.id);
      sendResponse(res, [parcel]);
    }
  } catch (err) {
    console.log(err);
    sendError(res, err);
  }
});

router.patch('/:parcel/destination', requireAuth, allowOnlyParcelCreator, orderNotDelivered, async (req, res) => {
  try {
    const parcel = await Parcel.updateDestination(req.body.to, req.params.parcel);
    const { id, to } = parcel;
    sendResponse(res, { message: 'Parcel destination updated', id, to });
  } catch (err) {
    sendError(res, err);
  }
});

router.patch('/:parcel/cancel', requireAuth, allowOnlyParcelCreator, orderNotDelivered, async (req, res) => {
  try {
    const parcel = await Parcel.updateStatus(req.body.status, req.params.parcel);
    const { id, status } = parcel;
    sendResponse(res, { message: 'Parcel has been cancelled', id, status });
  } catch (err) {
    sendError(res, err);
  }
});

router.patch('/:parcel/status', requireAuth, allowOnlyAdmins, async (req, res) => {
  try {
    const parcel = await Parcel.updateStatus(req.body.status, req.params.parcel);
    const { id, status } = parcel;
    sendResponse(res, { message: 'Parcel status updated', id, status });
  } catch (err) {
    sendError(res, err);
  }
});

router.patch('/:parcel/delivered', requireAuth, allowOnlyAdmins, async (req, res) => {
  try {
    const parcel = await Parcel.markDelivered(req.params.parcel);
    const { id, deliveredon } = parcel;
    sendResponse(res, { message: 'Parcel marked delivered', id, deliveredon });
  } catch (err) {
    sendError(res, err);
  }
});

router.patch('/:parcel/currentlocation', requireAuth, allowOnlyAdmins, async (req, res) => {
  try {
    const parcel = await Parcel.updateCurrentLocation(req.body.currentlocation, req.params.parcel);
    const { id, currentlocation } = parcel;
    sendResponse(res, { message: 'Parcel location updated', id, currentlocation });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
