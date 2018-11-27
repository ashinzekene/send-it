import express from 'express';
import { createClient } from '@google/maps';
import { sendError, sendResponse } from '../../utils';

const router = express.Router();
const maps = createClient(process.env.MAPS_API_KEY);

router.post('/distance-matrix', (req, res) => {
  maps.distanceMatrix({
    origin: req.body.from,
    destination: req.body.destination,
  }, (err, result) => {
    if (err) {
      return sendError(res, err);
    }
    return sendResponse(res, result);
  });
});

export default router;
