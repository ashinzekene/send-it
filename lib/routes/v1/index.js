import express from 'express';
import swaggerUI from 'swagger-ui-express';
import userRouter from './users';
import parcelRouter from './parcels';
import authRouter from './auth';
import pool from '../../models/index';
import * as swaggerDoc from '../../swagger.json';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/parcels', parcelRouter);

router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

router.post('/drop/:type', async (req, res) => {
  try {
    await pool.query(`TRUNCATE TABLE ${req.params.type} CASCADE`);
    res.json({ message: 'Success' });
  } catch (err) {
    res.status(401).json({ message: 'Did not work' });
  }
});

export default router;
