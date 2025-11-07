// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { createServer } from 'http';
// import { initializeSocket } from './utils/Socket.js';
// import { connectDB } from './config/mongoDb.js';
// import { connectCloudinary, upload } from './config/cloudinary.js';
// import userRouter from './routes/userRoutes.js';
// import courseRouter from './routes/courseRoutes.js';
// import testRouter from './routes/testRoutes.js';
// import questionRouter from './routes/questionRoutes.js';
// import videoRouter from './routes/videoRoutes.js';
// import notesRouter from './routes/notesRoutes.js';
// import liveSessionRouter from './routes/liveSessionRoutes.js';
// import testResultRouter from './routes/testResultRoutes.js';
// import paymentRouter from './routes/paymentRoutes.js';
// import enrollmentRouter from './routes/enrollmentRoutes.js';
// import notificationRouter from './routes/notificationRoutes.js';
// import feedbackRouter from './routes/feedbackRoutes.js';
// import supportRouter from './routes/supportRoutes.js';
// import otpRouter from './routes/otpRoutes.js';
// import './models/UserModel.js';
// import './models/CourseModel.js';
// import './models/EnrollmentModel.js';
// import './models/NotificationModel.js';
// import './models/FeedbackModel.js';
// import './models/TestResultModel.js';
// import './models/SupportModel.js';
// import './models/PaymentModel.js';
// import './models/TestModel.js';
// import './models/VideoModel.js';
// import './models/NotesModel.js';
// import './models/LiveSessionModel.js';
// import './models/QuestionModel.js';
// import './models/OtpModel.js';
// import { scheduleNotifications } from './utils/ScheduleNotifications.js';
// import cron from 'node-cron';
// import { expireEnrollments } from './controllers/enrollmentController.js'

// // dotenv.config();
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// dotenv.config({ path: envFile });
// console.log('Loaded env:', envFile);


// const app = express();
// const port = process.env.PORT || 5000;
// const server = createServer(app);
// const io = initializeSocket(server);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL,'https://satscorer.com','https://www.satscorer.com','https://admin.satscorer.com','http://localhost:5173','http://localhost:5174'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-signature'],
//   credentials: true,
// }));

// connectDB();
// connectCloudinary();
// scheduleNotifications(io);

// // Middleware to capture raw body for webhook
// app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
//   const rawBody = req.body.toString('utf8');
//   req.rawBody = rawBody;
//   console.log('Webhook middleware - raw body captured:', rawBody);
//   try {
//     req.body = JSON.parse(rawBody);
//   } catch (error) {
//     console.error('Error parsing webhook payload:', error.message);
//     return res.status(400).json({ message: 'Invalid webhook payload format' });
//   }
//   next();
// });

// app.use('/api/user', userRouter);
// app.use('/api/course', courseRouter);
// app.use('/api/test', testRouter);
// app.use('/api/question', questionRouter);
// app.use('/api/video', videoRouter);
// app.use('/api/notes', notesRouter);
// app.use('/api/livesession', liveSessionRouter);
// app.use('/api/testresult', testResultRouter);
// app.use('/api/payment', paymentRouter);
// app.use('/api/enrollment', enrollmentRouter);
// app.use('/api/notification', notificationRouter);
// app.use('/api/feedback', feedbackRouter);
// app.use('/api/support', supportRouter);
// app.use('/api/otp', otpRouter);

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   try {
//     res.json({ url: req.file.path });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to upload image', error: error.message });
//   }
// });

// app.get('/', (req, res) => {
//   res.send('API WORKING');
// });

// console.log('Environment Variables Loaded:', {
//   CASHFREE_APP_ID: process.env.CASHFREE_APP_ID ? 'Set' : 'Missing',
//   CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? 'Set' : 'Missing',
//   CASHFREE_API_URL: process.env.CASHFREE_API_URL,
//   CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? 'Set' : 'Missing',
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
//   CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Missing',
//   GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'Missing',
//   GMAIL_PASS: process.env.GMAIL_PASS ? 'Set' : 'Missing',
// });

// server.listen(port, '0.0.0.0', () => console.log(`Server started at port ${port}...`));

// // Schedule daily job to expire enrollments at midnight (00:00 every day)
// cron.schedule('* * * * *', expireEnrollments);
// // 


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './utils/Socket.js';
import { connectDB } from './config/mongoDb.js';
import { connectCloudinary, upload } from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import testRouter from './routes/testRoutes.js';
import questionRouter from './routes/questionRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import liveSessionRouter from './routes/liveSessionRoutes.js';
import testResultRouter from './routes/testResultRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import enrollmentRouter from './routes/enrollmentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import supportRouter from './routes/supportRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import visitorRouter from './routes/visitorRoutes.js';
import './models/UserModel.js';
import './models/VisitorModel.js';
import './models/CourseModel.js';
import './models/EnrollmentModel.js';
import './models/NotificationModel.js';
import './models/FeedbackModel.js';
import './models/TestResultModel.js';
import './models/SupportModel.js';
import './models/PaymentModel.js';
import './models/TestModel.js';
import './models/VideoModel.js';
import './models/NotesModel.js';
import './models/LiveSessionModel.js';
import './models/QuestionModel.js';
import './models/OtpModel.js';
import { scheduleNotifications } from './utils/ScheduleNotifications.js';
import cron from 'node-cron';
import { expireEnrollments } from './controllers/enrollmentController.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
console.log('Loaded env:', envFile);

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = initializeSocket(server);

// Apply CORS middleware first
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://satscorer.com',
    'https://www.satscorer.com',
    'https://admin.satscorer.com',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-signature'],
  credentials: true,
  preflightContinue: false, // Ensure preflight requests are handled correctly
  optionsSuccessStatus: 204, // Return 204 for OPTIONS requests
}));

// Middleware for JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for webhook raw body parsing
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  const rawBody = req.body.toString('utf8');
  req.rawBody = rawBody;
  console.log('Webhook middleware - raw body captured:', rawBody);
  try {
    req.body = JSON.parse(rawBody);
  } catch (error) {
    console.error('Error parsing webhook payload:', error.message);
    return res.status(400).json({ message: 'Invalid webhook payload format' });
  }
  next();
});

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'PUT' && req.url === '/api/user/profile') {
    console.log('PUT /api/user/profile body:', req.body);
    console.log('PUT /api/user/profile file:', req.file);
  }
  next();
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/test', testRouter);
app.use('/api/question', questionRouter);
app.use('/api/video', videoRouter);
app.use('/api/notes', notesRouter);
app.use('/api/livesession', liveSessionRouter);
app.use('/api/testresult', testResultRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/enrollment', enrollmentRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/support', supportRouter);
app.use('/api/otp', otpRouter);
app.use('/api/contact', contactRouter);
app.use('/api/visitor', visitorRouter);

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API WORKING');
});

connectDB();
connectCloudinary();
scheduleNotifications(io);

// Schedule daily job to expire enrollments at midnight
cron.schedule('* * * * *', expireEnrollments);

server.listen(port, '0.0.0.0', () => console.log(`Server started at port ${port}...`));