import express from 'express';
import Parcel from '../../models/parcel';
import auth from '../../utils/custom-auth';
import utils from '../../utils/index';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'You should get all parcels' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get a parcel by its ID' });
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
