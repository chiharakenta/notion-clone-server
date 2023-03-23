import { Router } from 'express';
import { authRouter } from './auth';
import { memoRouter } from './memo';

export const router = Router();
router.use('/auth', authRouter);
router.use('/memo', memoRouter);
