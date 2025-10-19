import userModel from '../models/UserModel.js';
import otpModel from '../models/OtpModel.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const cleanExpiredOtps = async (userId) => {
  const now = new Date();
  const deleted = await otpModel.deleteMany({ userId, expiresAt: { $lte: now } });
  if (deleted.deletedCount > 0) {
    const remainingOtps = await otpModel.find({ userId }).select('_id');
    const remainingIds = remainingOtps.map(otp => otp._id);
    await userModel.updateOne({ _id: userId }, { $set: { otps: remainingIds } });
  }
};

const sendOtpEmail = async (email, otp, validityMinutes) => {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Missing environment variables for email configuration:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_PASS: !!process.env.GMAIL_PASS,
      });
      throw new Error('Email configuration error: Missing environment variables');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const subject = 'SATscorer OTP Verification';
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 20px; text-align: center; color: white; }
          .content { padding: 30px; }
          .otp { font-size: 24px; font-weight: bold; color: #3b82f6; text-align: center; margin: 20px 0; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SATscorer</h1>
            <h3>OTP Verification</h3>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Your One-Time Password (OTP) for SATscorer admin panel access is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for ${validityMinutes} minute${validityMinutes > 1 ? 's' : ''}. Please do not share this OTP with anyone for security reasons.</p>
            <p>If you didn't request this OTP, please contact our support team immediately.</p>
            <a href="mailto:support@satscorer.com" class="button">Contact Support</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SATscorer. All rights reserved.</p>
            <p>123 Education Lane, Learning City, ED 12345</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending OTP email:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    await cleanExpiredOtps(user._id);

    const activeOtp = await otpModel.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() },
    });

    if (activeOtp && user.role === 'admin') {
      return res.status(429).json({ message: 'Please wait before requesting a new OTP' });
    }

    const otp = generateOtp();
    const validityMinutes = user.role === 'admin' ? 1 : 2;
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

    const otpRecord = new otpModel({
      userId: user._id,
      otp,
      expiresAt,
    });

    await otpRecord.save();
    await userModel.findByIdAndUpdate(user._id, { $push: { otps: otpRecord._id } });

    await sendOtpEmail(email, otp, validityMinutes);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ message: error.message || 'Server error while requesting OTP' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    await cleanExpiredOtps(user._id);

    const otpRecord = await otpModel.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    await otpRecord.deleteOne();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};

export { requestOtp, verifyOtp };