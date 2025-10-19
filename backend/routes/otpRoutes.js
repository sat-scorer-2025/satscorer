import express from 'express';
import { requestOtp, verifyOtp } from '../controllers/otpController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const otpRouter = express.Router();

otpRouter.post('/request', requestOtp);
otpRouter.post('/verify', verifyOtp);

export default otpRouter;