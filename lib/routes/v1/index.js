import express from 'express';
import userRouter from './users';
import parcelRouter from './parcels';

const router = express.Router();

router.use('/users', userRouter);

router.use('/parcels', parcelRouter);

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the version 1 API' });
});

export default router;
