import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import PaymentModel from '../models/PaymentModel.js';
import CourseModel from '../models/CourseModel.js';
import UserModel from '../models/UserModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';
import NotificationModel from '../models/NotificationModel.js';
import { emitNotification } from '../utils/Socket.js';
import { verifyWebhookSignature } from '../utils/CashfreeWebhook.js';

const CASHFREE_API_URL = process.env.CASHFREE_API_URL
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const initiatePayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user.userId;

    console.log('Initiate Payment Request:', { courseId, amount, userId });

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error('Missing Cashfree credentials:', {
        appIdSet: !!CASHFREE_APP_ID,
        secretKeySet: !!CASHFREE_SECRET_KEY,
      });
      return res.status(500).json({ message: 'Payment gateway configuration error' });
    }

    if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid course ID or user ID' });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    if (amount !== course.price) {
      console.error(`Amount mismatch: Provided ${amount}, Expected ${course.price}`);
      return res.status(400).json({ message: 'Amount does not match course price' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingEnrollment = await EnrollmentModel.findOne({ userId, courseId, status: 'active' });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    const payment = new PaymentModel({
      userId,
      courseId,
      amount,
      status: 'pending',
      paymentDate: new Date(),
      cashfreeOrderId: `order_${Date.now()}_${userId}`,
      paymentMethod: 'unknown',
    });
    await payment.save();

    const orderData = {
      order_id: payment.cashfreeOrderId,
      order_amount: amount.toFixed(2), 
      order_currency: 'INR',
      customer_details: {
        customer_id: userId.toString(),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment/success?order_id={order_id}`,
        notify_url: `${process.env.SERVER_URL}/api/payment/webhook`,
      },
  };

    console.log('Sending Cashfree order request:', {
      order_id: orderData.order_id,
      order_amount: orderData.order_amount,
      api_url: CASHFREE_API_URL,
    });

    const response = await axios.post(`${CASHFREE_API_URL}/orders`, orderData, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    const { payment_session_id, order_id } = response.data;

    await UserModel.findByIdAndUpdate(userId, { $push: { payments: payment._id } });

    res.status(200).json({ payment_session_id, order_id });
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error while initiating payment', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-webhook-signature'];

    console.log('Webhook raw body:', rawBody);
    console.log('Webhook headers:', JSON.stringify(req.headers, null, 2));
    console.log('Webhook payload received:', JSON.stringify(req.body, null, 2));

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Webhook signature verification failed');
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }

    const { data, type } = req.body;

    if (!data?.order?.order_id || !type) {
      console.error('Invalid webhook payload:', { data, type });
      return res.status(400).json({ message: 'Missing order_id or type' });
    }

    if (type !== 'PAYMENT_SUCCESS_WEBHOOK' && type !== 'PAYMENT_FAILED_WEBHOOK' && type !== 'PAYMENT_USER_DROPPED_WEBHOOK') {
      console.warn('Unsupported webhook event:', type);
      return res.status(200).json({ message: 'Unsupported webhook event ignored' });
    }

    const paymentRecord = await PaymentModel.findOne({ cashfreeOrderId: data.order.order_id });
    if (!paymentRecord) {
      console.error('Payment not found for order_id:', data.order.order_id);
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentRecord.status !== 'pending') {
      console.warn('Payment already processed:', { order_id: data.order.order_id, current_status: paymentRecord.status });
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Extract transaction ID
    const transactionId = data.payment?.cf_payment_id?.toString() || data.cf_payment_id?.toString() || 'N/A';
    console.log('Transaction ID extracted:', { transactionId, sources: {
      paymentCfPaymentId: data.payment?.cf_payment_id,
      cfPaymentId: data.cf_payment_id,
    } });

    // Extract payment method
    let paymentMethod = 'unknown';
    if (data.payment?.payment_group) {
      const paymentGroup = data.payment.payment_group.toLowerCase();
      switch (paymentGroup) {
        case 'debit_card':
          paymentMethod = 'debit card';
          break;
        case 'credit_card':
          paymentMethod = 'credit card';
          break;
        case 'upi':
          paymentMethod = 'upi';
          break;
        case 'net_banking':
          paymentMethod = 'netbanking';
          break;
        case 'wallet':
          paymentMethod = 'wallet';
          break;
        default:
          console.warn('Unknown payment_group:', paymentGroup);
          paymentMethod = 'unknown';
      }
    } else if (data.payment?.payment_method) {
      paymentMethod = Object.keys(data.payment.payment_method)[0]?.toLowerCase() || 'unknown';
    }
    console.log('Payment method extracted:', { paymentMethod, sources: {
      paymentGroup: data.payment?.payment_group,
      paymentMethodObj: data.payment?.payment_method ? Object.keys(data.payment.payment_method)[0] : null,
    } });

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        paymentRecord.status =
          type === 'PAYMENT_SUCCESS_WEBHOOK' ? 'completed' :
          type === 'PAYMENT_FAILED_WEBHOOK' ? 'failed' :
          'pending';
        paymentRecord.paymentDate = new Date();
        paymentRecord.transactionId = transactionId;
        paymentRecord.paymentMethod = paymentMethod;
        await paymentRecord.save({ session });

        console.log('Payment record updated:', {
          order_id: data.order.order_id,
          status: paymentRecord.status,
          transactionId: paymentRecord.transactionId,
          paymentMethod: paymentRecord.paymentMethod,
        });

        if (paymentRecord.status === 'completed') {
          const existingEnrollment = await EnrollmentModel.findOne({
            userId: paymentRecord.userId,
            courseId: paymentRecord.courseId,
            status: 'active',
          }).session(session);

          if (!existingEnrollment) {
            const enrollment = new EnrollmentModel({
              userId: paymentRecord.userId,
              courseId: paymentRecord.courseId,
              enrolledAt: new Date(),
              status: 'active',
            });
            await enrollment.save({ session });

            await Promise.all([
              UserModel.findByIdAndUpdate(
                paymentRecord.userId,
                { $push: { enrolledCourses: enrollment._id } },
                { session }
              ),
              CourseModel.findByIdAndUpdate(
                paymentRecord.courseId,
                { $push: { enrollments: enrollment._id } },
                { session }
              ),
            ]);

            console.log('Enrollment created for user:', paymentRecord.userId);

            // Fetch user and course details for notification
            const user = await UserModel.findById(paymentRecord.userId).session(session);
            const course = await CourseModel.findById(paymentRecord.courseId).session(session);

            // Find all admin users
            const admins = await UserModel.find({ role: 'admin' }).select('_id').session(session);
            const adminIds = admins.map(admin => admin._id);

            // Create notification for admins
            const enrollmentNotification = new NotificationModel({
              title: 'New Course Enrollment 🔔',
              message: `Student 🧑🏻‍🎓: ${user.name} [${user.email}] enrolled in the ${course.title} on ${new Date().toLocaleString()}`,
              image: '',
              userId: adminIds,
              readBy: [],
              type: 'announcement',
              recipient: 'Admin',
              scheduledAt: null,
              status: 'sent',
              channel: 'in-app',
            });

            await enrollmentNotification.save({ session });

            // Add notification to admins' notifications array
            await UserModel.updateMany(
              { _id: { $in: adminIds } },
              { $push: { notifications: enrollmentNotification._id } },
              { session }
            );

            // Emit real-time notification to admins via socket
            // Note: emitNotification is outside transaction as it's not database-related
            emitNotification(adminIds.map(id => id.toString()), enrollmentNotification);
          }
        }
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while processing webhook', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, courseId, userId } = req.body;

    if (!orderId || !mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid order ID, course ID, or user ID` });
    }

    const paymentRecord = await PaymentModel.findOne({ cashfreeOrderId: orderId });
    if (!paymentRecord) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentRecord.status === 'completed') {
      return res.status(200).json({ message: 'Payment already processed and user enrolled' });
    }

    // Fetch payment details from Cashfree /orders/{orderId}/payments
    const paymentResponse = await axios.get(`${CASHFREE_API_URL}/orders/${orderId}/payments`, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    console.log('Verify payment full response:', JSON.stringify(paymentResponse.data, null, 2));

    // Handle both possible response structures
    const paymentData = Array.isArray(paymentResponse.data) ? paymentResponse.data[0] : paymentResponse.data?.data?.[0];
    if (!paymentData) {
      console.error('No payment data found in response:', paymentResponse.data);
      paymentRecord.status = 'failed';
      await paymentRecord.save();
      return res.status(400).json({ message: 'Payment not completed' });
    }

    if (paymentData.payment_status !== 'SUCCESS') {
      console.error('Payment not successful:', { payment_status: paymentData.payment_status });
      paymentRecord.status = 'failed';
      await paymentRecord.save();
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Extract payment method
    let paymentMethod = 'unknown';
    if (paymentData.payment_group) {
      const paymentGroup = paymentData.payment_group.toLowerCase();
      switch (paymentGroup) {
        case 'debit_card':
          paymentMethod = 'debit card';
          break;
        case 'credit_card':
          paymentMethod = 'credit card';
          break;
        case 'upi':
          paymentMethod = 'upi';
          break;
        case 'net_banking':
          paymentMethod = 'netbanking';
          break;
        case 'wallet':
          paymentMethod = 'wallet';
          break;
        default:
          console.warn('Unknown payment_group:', paymentGroup);
          paymentMethod = 'unknown';
      }
    } else if (paymentData.payment_method) {
      paymentMethod = Object.keys(paymentData.payment_method)[0]?.toLowerCase() || 'unknown';
    }
    console.log('Verify payment method extracted:', { paymentMethod, sources: {
      paymentGroup: paymentData.payment_group,
      paymentMethodObj: paymentData.payment_method ? Object.keys(paymentData.payment_method)[0] : null,
    } });

    // Extract transaction ID
    const transactionId = paymentData.cf_payment_id?.toString() || 'N/A';
    console.log('Verify transaction ID extracted:', { transactionId, source: paymentData.cf_payment_id });

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        paymentRecord.status = 'completed';
        paymentRecord.paymentDate = new Date();
        paymentRecord.transactionId = transactionId;
        paymentRecord.paymentMethod = paymentMethod;
        await paymentRecord.save({ session });

        const existingEnrollment = await EnrollmentModel.findOne({
          userId,
          courseId,
          status: 'active',
        }).session(session);

        if (!existingEnrollment) {
          const enrollment = new EnrollmentModel({
            userId,
            courseId,
            enrolledAt: new Date(),
            status: 'active',
          });
          await enrollment.save({ session });

          await Promise.all([
            UserModel.findByIdAndUpdate(userId, { $push: { enrolledCourses: enrollment._id } }, { session }),
            CourseModel.findByIdAndUpdate(courseId, { $push: { enrollments: enrollment._id } }, { session }),
          ]);

          // Fetch user and course details for notification
          const user = await UserModel.findById(userId).session(session);
          const course = await CourseModel.findById(courseId).session(session);

          // Find all admin users
          const admins = await UserModel.find({ role: 'admin' }).select('_id').session(session);
          const adminIds = admins.map(admin => admin._id);

          // Create notification for admins
          const enrollmentNotification = new NotificationModel({
            title: 'New Course Enrollment 🔔',
            message: `Student 🧑🏻‍🎓: ${user.name} [${user.email}] enrolled in the ${course.title} on ${new Date().toLocaleString()}`,
            image: '',
            userId: adminIds,
            readBy: [],
            type: 'announcement',
            recipient: 'Admin',
            scheduledAt: null,
            status: 'sent',
            channel: 'in-app',
          });

          await enrollmentNotification.save({ session });

          // Add notification to admins' notifications array
          await UserModel.updateMany(
            { _id: { $in: adminIds } },
            { $push: { notifications: enrollmentNotification._id } },
            { session }
          );

          // Emit real-time notification to admins via socket
          // Note: emitNotification is outside transaction as it's not database-related
          emitNotification(adminIds.map(id => id.toString()), enrollmentNotification);
        }
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({ message: 'Payment verified and user enrolled successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error while verifying payment', error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const payments = await PaymentModel.find({ userId })
      .populate('courseId', 'title')
      .populate('userId', 'name email address')
      .sort({ paymentDate: -1 })
      .lean();
    res.status(200).json({
      message: 'Payment history retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error while fetching payment history', error: error.message });
  }
};

const getAllPayment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const { startDate, endDate, allStatuses, previousStartDate, previousEndDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (previousStartDate && previousEndDate) {
      query.paymentDate = {
        $gte: new Date(previousStartDate),
        $lte: new Date(previousEndDate),
      };
    }
    if (!allStatuses) {
      query.status = 'completed';
    }
    const payments = await PaymentModel.find(query)
      .populate('userId', 'name email address phone')
      .populate('courseId', 'title examType price')
      .sort({ paymentDate: -1 })
      .lean();
    res.status(200).json({
      message: 'All payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ message: 'Server error while fetching all payments', error: error.message });
  }
};

const getPaymentForAUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const payments = await PaymentModel.find({ userId })
      .populate('courseId', 'title')
      .populate('userId', 'name email address')
      .sort({ paymentDate: -1 })
      .lean();
    res.status(200).json({
      message: 'User payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Server error while fetching user payments', error: error.message });
  }
};

export { initiatePayment, updatePaymentStatus, verifyPayment, getPaymentHistory, getAllPayment, getPaymentForAUser };