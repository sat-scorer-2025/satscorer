import express from 'express';
import {
  initiatePayment,
  getPaymentHistory,
  getAllPayment,
  getPaymentForAUser,
  updatePaymentStatus,
  verifyPayment,
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/initiate', authMiddleware, initiatePayment);
paymentRouter.post('/verify', authMiddleware, verifyPayment);
paymentRouter.get('/mypayments', authMiddleware, getPaymentHistory);
paymentRouter.get('/', authMiddleware, getAllPayment);
paymentRouter.get('/user/:userId', authMiddleware, getPaymentForAUser);
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), updatePaymentStatus);

export default paymentRouter;
