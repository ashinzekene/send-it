import express from 'express';
import userRouter from './users';
import parcelRouter from './parcels';
import authRouter from './auth';
import pool from '../../models/index';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/parcels', parcelRouter);

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the version 1 API' });
});

router.post('/drop/:type', async (req, res) => {
  try {
    await pool.query(`TRUNCATE TABLE ${req.params.type} CASCADE`);
    res.json({ message: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Did not work' });
  }
});

export default router;
