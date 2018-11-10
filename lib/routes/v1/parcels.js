import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'You should get all parcels' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get a parcel by its ID' });
});

export default router;
