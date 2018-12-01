import express from 'express';
import { createClient } from '@google/maps';
import { sendError, sendResponse } from '../../utils';

const router = express.Router();
const maps = createClient({
  key: process.env.MAPS_API_KEY,
  Promise,
});

router.post('/distance-matrix', async (req, res) => {
  try {
    const { json } = await maps.distanceMatrix({
      origins: req.body.origin,
      destinations: req.body.destination,
    }).asPromise();
    sendResponse(res, json);
  } catch (err) {
    sendError(res, err, 401);
  }
});

export default router;
