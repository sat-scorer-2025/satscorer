import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

let cashfree;

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const initializePaymentGateway = async (retries = 3, delay = 500) => {
  if (cashfree) return cashfree;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const mode = import.meta.env.VITE_CASHFREE_ENV;
      if (!['production'].includes(mode)) {
        throw new Error(`Invalid Cashfree environment mode: ${mode}`);
      }

      cashfree = await load({ mode });
      console.log('Cashfree SDK initialized successfully');
      return cashfree;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error initializing Cashfree SDK:`, error);
      if (attempt === retries) {
        throw new Error(`Failed to initialize payment gateway after ${retries} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const createPaymentOrder = async (courseId, userId, order_amount) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    let finalUserId = userId;
    if (!userId) {
      try {
        const decoded = jwtDecode(token);
        finalUserId = decoded.userId;
        console.log('Decoded userId from token:', finalUserId);
      } catch (err) {
        console.error('Failed to decode userId from token:', err);
        throw new Error('User not authenticated');
      }
    }

    if (!courseId || !finalUserId || !order_amount) {
      console.error('Invalid inputs for createPaymentOrder:', { courseId, userId: finalUserId, order_amount });
      throw new Error('Missing required payment parameters');
    }

    const amount = parseFloat(order_amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Valid order amount is required');
    }

    console.log('Creating payment order:', { courseId, userId: finalUserId, amount });

    const response = await axios.post(
      `${API_URL}/api/payment/initiate`,
      { courseId, userId: finalUserId, amount },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    console.log('Cashfree Order Response:', response.data);
    console.log('Payment order created:', {
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });

    return {
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    };
  } catch (error) {
    console.error('Error creating payment order:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create payment order');
  }
};

const verifyAndEnroll = async (orderId, courseId, userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    let finalUserId = userId;
    if (!userId) {
      try {
        const decoded = jwtDecode(token);
        finalUserId = decoded.userId;
        console.log('Decoded userId from token for verification:', finalUserId);
      } catch (err) {
        console.error('Failed to decode userId from token:', err);
        throw new Error('User not authenticated');
      }
    }

    console.log('Verifying payment:', {
      orderId,
      courseId,
      userId: finalUserId,
      orderIdType: typeof orderId,
      courseIdType: typeof courseId,
      userIdType: typeof finalUserId,
    });

    const response = await axios.post(
      `${API_URL}/api/payment/verify`,
      { orderId, courseId, userId: finalUserId },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('Payment verified:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

const handlePayment = async (courseId, userId, order_amount) => {
  console.log('handlePayment parameters:', { courseId, userId, order_amount });
  try {
    await initializePaymentGateway();
    const { payment_session_id, order_id } = await createPaymentOrder(courseId, userId, order_amount);

    if (!payment_session_id || !order_id) {
      throw new Error('Invalid payment session or order ID');
    }

    console.log('Initiating Cashfree checkout:', { payment_session_id, order_id });

    const checkoutOptions = {
      paymentSessionId: payment_session_id,
      redirectTarget: '_modal',
    };

    return new Promise((resolve, reject) => {
      cashfree
        .checkout(checkoutOptions)
        .then(async () => {
          try {
            const result = await verifyAndEnroll(order_id, courseId, userId);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          console.error('Checkout error:', error);
          reject(new Error('Payment process interrupted'));
        });
    });
  } catch (error) {
    throw error;
  }
};

export { handlePayment };