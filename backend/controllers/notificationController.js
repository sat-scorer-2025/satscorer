// import mongoose from 'mongoose';
// import NotificationModel from '../models/NotificationModel.js';
// import UserModel from '../models/UserModel.js';
// import CourseModel from '../models/CourseModel.js';
// import { emitNotification } from '../utils/Socket.js';
// import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
// import EnrollmentModel from '../models/EnrollmentModel.js';
// import nodemailer from 'nodemailer';

// // Email HTML Template
// const generateEmailTemplate = (title, message, imageUrl) => {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <meta http-equiv="X-UA-Compatible" content="ie=edge">
//       <title>SATscorer Notification</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           margin: 0;
//           padding: 0;
//           background-color: #f4f4f4;
//         }
//         .container {
//           max-width: 600px;
//           margin: 20px auto;
//           background: #ffffff;
//           border-radius: 8px;
//           overflow: hidden;
//           box-shadow: 0 0 10px rgba(0,0,0,0.1);
//         }
//         .header {
//           background: linear-gradient(to right, #3b82f6, #8b5cf6);
//           padding: 20px;
//           text-align: center;
//           color: white;
//         }
//         .header h1 {
//           margin: 0;
//           font-size: 24px;
//         }
//         .header h3 {
//           margin: 5px 0 0;
//           font-size: 18px;
//           font-weight: normal;
//         }
//         .content {
//           padding: 30px;
//         }
//         .content p {
//           font-size: 16px;
//           line-height: 1.6;
//           color: #333333;
//           margin: 0 0 15px;
//         }
//         .content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 5px;
//           margin: 15px 0;
//         }
//         .button {
//           display: inline-block;
//           padding: 10px 20px;
//           background: #3b82f6;
//           color: white;
//           text-decoration: none;
//           border-radius: 5px;
//           margin: 10px 0;
//           font-size: 16px;
//         }
//         .footer {
//           background: #f4f4f4;
//           padding: 20px;
//           text-align: center;
//           font-size: 12px;
//           color: #666;
//         }
//         .footer a {
//           color: #3b82f6;
//           text-decoration: none;
//         }
//         @media only screen and (max-width: 600px) {
//           .container {
//             width: 100%;
//             margin: 10px;
//           }
//           .content {
//             padding: 20px;
//           }
//           .header h1 {
//             font-size: 20px;
//           }
//           .header h3 {
//             font-size: 16px;
//           }
//           .content p {
//             font-size: 14px;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>SATscorer</h1>
//           <h3>${title}</h3>
//         </div>
//         <div class="content">
//           <p>Dear User,</p>
//           <p>${message.replace(/\n/g, '<br>')}</p>
//           ${imageUrl ? `<img src="${imageUrl}" alt="Notification Image">` : ''}
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} SATscorer. All rights reserved.</p>
//           <p><a href="mailto:satscorer2025@gmail.com">Contact Support</a></p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// const getNotification = async (req, res) => {
//   try {
//     const userId = req.user?.userId;

//     if (!userId) {
//       console.error('No user ID provided in request');
//       return res.status(400).json({ message: 'User ID is required', notifications: [], count: 0 });
//     }

//     if (!mongoose.isValidObjectId(userId)) {
//       console.error('Invalid user ID format:', userId);
//       return res.status(400).json({ message: 'Invalid user ID format', notifications: [], count: 0 });
//     }

//     const notifications = await NotificationModel
//       .find({ userId: userId, status: 'sent', readBy: { $ne: userId } })
//       .populate('userId', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: notifications.length ? 'Notifications retrieved successfully' : 'No notifications found for this user',
//       count: notifications.length,
//       notifications,
//     });
//   } catch (error) {
//     console.error('Error fetching user notifications:', {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(500).json({ message: 'Server error while fetching notifications', error: error.message, notifications: [], count: 0 });
//   }
// };

// const markAsRead = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const notificationId = req.params.id;

//     if (!mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ message: 'Invalid user ID' });
//     }
//     if (!mongoose.isValidObjectId(notificationId)) {
//       return res.status(400).json({ message: 'Invalid notification ID' });
//     }

//     const notification = await NotificationModel.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     if (!notification.userId.some(id => id.toString() === userId)) {
//       return res.status(403).json({ message: 'Access denied. You are not a recipient of this notification' });
//     }

//     if (!notification.readBy.includes(userId)) {
//       notification.readBy.push(userId);
//       await notification.save();
//     }

//     await UserModel.updateOne(
//       { _id: userId },
//       { $pull: { notifications: notificationId } }
//     );

//     if (notification.readBy.length === notification.userId.length) {
//       if (notification.image) {
//         await deleteFromCloudinary(notification.image);
//       }
//       await NotificationModel.findByIdAndDelete(notificationId);
//       return res.status(200).json({
//         message: 'Notification marked as read and deleted from database as all users have read it',
//         notificationId,
//       });
//     }

//     res.status(200).json({
//       message: 'Notification marked as read successfully',
//       notificationId,
//       notification,
//     });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({ message: 'Server error while marking notification as read', error: error.message });
//   }
// };

// const createNotification = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required' });
//     }

//     const { title, message, type, recipient, audienceType, scheduledAt, channel } = req.body;

//     if (!title || !message || !type || !audienceType || !channel) {
//       return res.status(400).json({ message: 'Title, message, type, audience type, and channel are required' });
//     }

//     if (!['announcement', 'reminder'].includes(type)) {
//       return res.status(400).json({ message: 'Type must be announcement or reminder' });
//     }

//     if (!['all', 'course', 'student'].includes(audienceType)) {
//       return res.status(400).json({ message: 'Invalid audience type' });
//     }

//     if (!['in-app', 'email'].includes(channel)) {
//       return res.status(400).json({ message: 'Invalid notification channel' });
//     }

//     let userIds = [];
//     let recipientValue = recipient;
//     let emailAddresses = [];

//     if (audienceType === 'all') {
//       const users = await UserModel.find({ status: 'active', role: 'student' }).select('_id email');
//       userIds = users.map(user => user._id);
//       emailAddresses = users.map(user => user.email);
//       recipientValue = 'all';
//     } else if (audienceType === 'course') {
//       if (!mongoose.isValidObjectId(recipient)) {
//         return res.status(400).json({ message: 'Invalid course ID' });
//       }
//       const course = await CourseModel.findById(recipient);
//       if (!course) {
//         return res.status(404).json({ message: 'Course not found' });
//       }
//       const enrollments = await EnrollmentModel.find({ courseId: recipient }).populate('userId');
//       const activeStudents = enrollments
//         .map(enrollment => enrollment.userId)
//         .filter(user => user.status === 'active' && user.role === 'student');
//       userIds = activeStudents.map(user => user._id);
//       emailAddresses = activeStudents.map(user => user.email);
//       if (userIds.length === 0) {
//         return res.status(400).json({ message: 'No active students enrolled in this course' });
//       }
//     } else if (audienceType === 'student') {
//       if (!mongoose.isValidObjectId(recipient)) {
//         return res.status(400).json({ message: 'Invalid student ID' });
//       }
//       const user = await UserModel.findById(recipient);
//       if (!user || user.status !== 'active' || user.role !== 'student') {
//         return res.status(404).json({ message: 'Active student not found' });
//       }
//       userIds = [recipient];
//       emailAddresses = [user.email];
//     }

//     let imageUrl = '';
//     if (req.file && channel === 'email') {
//       try {
//         imageUrl = await uploadToCloudinary(req.file.path, 'SATscorer/notifications');
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
//       }
//     }

//     const notification = new NotificationModel({
//       title,
//       message,
//       image: imageUrl,
//       userId: userIds,
//       readBy: [],
//       type,
//       recipient: recipientValue,
//       scheduledAt: channel === 'in-app' && scheduledAt ? new Date(scheduledAt) : null,
//       status: channel === 'in-app' && scheduledAt ? 'pending' : 'sent',
//       channel,
//     });

//     await notification.save();

//     await UserModel.updateMany(
//       { _id: { $in: userIds } },
//       { $push: { notifications: notification._id } }
//     );

//     if (channel === 'email') {
//       if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
//         console.error('Missing environment variables for email configuration:', {
//           GMAIL_USER: !!process.env.GMAIL_USER,
//           GMAIL_PASS: !!process.env.GMAIL_PASS,
//         });
//         notification.status = 'failed';
//         await notification.save();
//         return res.status(500).json({ message: 'Email configuration error: Missing environment variables' });
//       }

//       try {
//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS,
//           },
//         });

//         const mailOptions = {
//           from: process.env.GMAIL_USER,
//           to: emailAddresses.join(','),
//           subject: title,
//           text: message,
//           html: generateEmailTemplate(title, message, imageUrl),
//         };

//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully to:', emailAddresses);
//       } catch (emailError) {
//         console.error('Error sending email:', {
//           message: emailError.message,
//           stack: emailError.stack,
//           response: emailError.response?.data,
//         });
//         notification.status = 'failed';
//         await notification.save();
//         return res.status(500).json({ message: 'Failed to send email notification', error: emailError.message });
//       }
//     } else if (channel === 'in-app' && !scheduledAt) {
//       emitNotification(userIds.map(id => id.toString()), notification);
//     }

//     res.status(201).json({
//       message: channel === 'email' ? 'Email notification sent successfully' : (scheduledAt ? 'Notification scheduled successfully' : 'Notification created successfully'),
//       notification,
//     });
//   } catch (error) {
//     console.error('Error creating notification:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//     res.status(500).json({ message: 'Server error while creating notification', error: error.message });
//   }
// };

// const getAllNotifications = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required' });
//     }

//     const { status } = req.query;
//     const query = {};
//     if (status) query.status = status;

//     const notifications = await NotificationModel
//       .find(query)
//       .populate('userId', 'name email')
//       .sort({ createdAt: -1 });

//     if (!notifications || notifications.length === 0) {
//       return res.status(404).json({ message: 'No notifications found' });
//     }

//     const enrichedNotifications = await Promise.all(notifications.map(async (notification) => {
//       let recipientDetails = {};
//       if (notification.recipient === 'all') {
//         recipientDetails = { type: 'all', value: 'All Students' };
//       } else if (mongoose.isValidObjectId(notification.recipient)) {
//         const course = await CourseModel.findById(notification.recipient);
//         if (course) {
//           recipientDetails = { type: 'course', value: course.title };
//         } else {
//           const user = await UserModel.findById(notification.recipient);
//           if (user) {
//             recipientDetails = { type: 'student', value: user.name };
//           }
//         }
//       }
//       return { ...notification.toObject(), recipientDetails };
//     }));

//     res.status(200).json({
//       message: 'All notifications retrieved successfully',
//       count: enrichedNotifications.length,
//       notifications: enrichedNotifications,
//     });
//   } catch (error) {
//     console.error('Error fetching all notifications:', error);
//     res.status(500).json({ message: 'Server error while fetching all notifications', error: error.message });
//   }
// };

// const deleteNotification = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required' });
//     }

//     const notificationId = req.params.id;
//     if (!mongoose.isValidObjectId(notificationId)) {
//       return res.status(400).json({ message: 'Invalid notification ID' });
//     }

//     const notification = await NotificationModel.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     if (notification.image) {
//       await deleteFromCloudinary(notification.image);
//     }

//     await UserModel.updateMany(
//       { notifications: notificationId },
//       { $pull: { notifications: notificationId } }
//     );

//     await NotificationModel.findByIdAndDelete(notificationId);

//     res.status(200).json({ message: 'Notification deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({ message: 'Server error while deleting notification', error: error.message });
//   }
// };

// const resendNotification = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required' });
//     }

//     const notificationId = req.params.id;
//     if (!mongoose.isValidObjectId(notificationId)) {
//       return res.status(400).json({ message: 'Invalid notification ID' });
//     }

//     const notification = await NotificationModel.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     notification.status = 'sent';
//     notification.createdAt = new Date();
//     notification.readBy = [];
//     await notification.save();

//     await UserModel.updateMany(
//       { _id: { $in: notification.userId } },
//       { $push: { notifications: notification._id } }
//     );

//     if (notification.channel === 'email') {
//       const users = await UserModel.find({ _id: { $in: notification.userId } }).select('email');
//       const emailAddresses = users.map(user => user.email);

//       if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
//         console.error('Missing environment variables for email configuration:', {
//           GMAIL_USER: !!process.env.GMAIL_USER,
//           GMAIL_PASS: !!process.env.GMAIL_PASS,
//         });
//         notification.status = 'failed';
//         await notification.save();
//         return res.status(500).json({ message: 'Email configuration error: Missing environment variables' });
//       }

//       try {
//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS,
//           },
//         });

//         const mailOptions = {
//           from: process.env.GMAIL_USER,
//           to: emailAddresses.join(','),
//           subject: notification.title,
//           text: notification.message,
//           html: generateEmailTemplate(notification.title, notification.message, notification.image),
//         };

//         await transporter.sendMail(mailOptions);
//         console.log('Email resent successfully to:', emailAddresses);
//       } catch (emailError) {
//         console.error('Error resending email:', {
//           message: emailError.message,
//           stack: emailError.stack,
//           response: emailError.response?.data,
//         });
//         notification.status = 'failed';
//         await notification.save();
//         return res.status(500).json({ message: 'Failed to resend email notification', error: emailError.message });
//       }
//     } else {
//       emitNotification(notification.userId.map(id => id.toString()), notification);
//     }

//     res.status(200).json({
//       message: 'Notification resent successfully',
//       notification,
//     });
//   } catch (error) {
//     console.error('Error resending notification:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data,
//     });
//     res.status(500).json({ message: 'Server error while resending notification', error: error.message });
//   }
// };

// export { getNotification, markAsRead, createNotification, getAllNotifications, deleteNotification, resendNotification };




import mongoose from 'mongoose';
import NotificationModel from '../models/NotificationModel.js';
import UserModel from '../models/UserModel.js';
import CourseModel from '../models/CourseModel.js';
import { emitNotification } from '../utils/Socket.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import EnrollmentModel from '../models/EnrollmentModel.js';
import nodemailer from 'nodemailer';

// Email HTML Template (unchanged)
const generateEmailTemplate = (title, message, imageUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>SATscorer Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header h3 {
          margin: 5px 0 0;
          font-size: 18px;
          font-weight: normal;
        }
        .content {
          padding: 30px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
          margin: 0 0 15px;
        }
        .content img {
          max-width: 100%;
          height: auto;
          border-radius: 5px;
          margin: 15px 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
          font-size: 16px;
        }
        .footer {
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            margin: 10px;
          }
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 20px;
          }
          .header h3 {
            font-size: 16px;
          }
          .content p {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SATscorer</h1>
          <h3>${title}</h3>
        </div>
        <div class="content">
          <p>Dear User,</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          ${imageUrl ? `<img src="${imageUrl}" alt="Notification Image">` : ''}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SATscorer. All rights reserved.</p>
          <p><a href="mailto:satscorer2025@gmail.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getNotification = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      console.error('No user ID provided in request');
      return res.status(400).json({ message: 'User ID is required', notifications: [], count: 0 });
    }

    if (!mongoose.isValidObjectId(userId)) {
      console.error('Invalid user ID format:', userId);
      return res.status(400).json({ message: 'Invalid user ID format', notifications: [], count: 0 });
    }

    const notifications = await NotificationModel
      .find({ userId: userId, status: 'sent', readBy: { $ne: userId } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: notifications.length ? 'Notifications retrieved successfully' : 'No notifications found for this user',
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching user notifications:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error while fetching notifications', error: error.message, notifications: [], count: 0 });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.userId.some(id => id.toString() === userId)) {
      return res.status(403).json({ message: 'Access denied. You are not a recipient of this notification' });
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { notifications: notificationId } }
    );

    if (notification.readBy.length === notification.userId.length) {
      if (notification.image) {
        await deleteFromCloudinary(notification.image);
      }
      await NotificationModel.findByIdAndDelete(notificationId);
      return res.status(200).json({
        message: 'Notification marked as read and deleted from database as all users have read it',
        notificationId,
      });
    }

    res.status(200).json({
      message: 'Notification marked as read successfully',
      notificationId,
      notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error while marking notification as read', error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const { title, message, type, recipient, audienceType, scheduledAt, channel } = req.body;

    if (!title || !message || !type || !audienceType || !channel) {
      return res.status(400).json({ message: 'Title, message, type, audience type, and channel are required' });
    }

    if (!['announcement', 'reminder'].includes(type)) {
      return res.status(400).json({ message: 'Type must be announcement or reminder' });
    }

    if (!['all', 'course', 'student'].includes(audienceType)) {
      return res.status(400).json({ message: 'Invalid audience type' });
    }

    if (!['in-app', 'email'].includes(channel)) {
      return res.status(400).json({ message: 'Invalid notification channel' });
    }

    let userIds = [];
    let recipientValue = recipient;
    let emailAddresses = [];

    if (audienceType === 'all') {
      const users = await UserModel.find({ status: 'active', role: 'student' }).select('_id email');
      userIds = users.map(user => user._id);
      emailAddresses = users.map(user => user.email);
      recipientValue = 'all';
    } else if (audienceType === 'course') {
      if (!mongoose.isValidObjectId(recipient)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      const course = await CourseModel.findById(recipient);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const enrollments = await EnrollmentModel.find({ courseId: recipient }).populate('userId');
      const activeStudents = enrollments
        .map(enrollment => enrollment.userId)
        .filter(user => user.status === 'active' && user.role === 'student');
      userIds = activeStudents.map(user => user._id);
      emailAddresses = activeStudents.map(user => user.email);
      if (userIds.length === 0) {
        return res.status(400).json({ message: 'No active students enrolled in this course' });
      }
    } else if (audienceType === 'student') {
      if (!mongoose.isValidObjectId(recipient)) {
        return res.status(400).json({ message: 'Invalid student ID' });
      }
      const user = await UserModel.findById(recipient);
      if (!user || user.status !== 'active' || user.role !== 'student') {
        return res.status(404).json({ message: 'Active student not found' });
      }
      userIds = [recipient];
      emailAddresses = [user.email];
    }

    let imageUrl = '';
    if (req.file && channel === 'email') {
      try {
        imageUrl = await uploadToCloudinary(req.file.path, 'SATscorer/notifications');
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading image', error: uploadError.message });
      }
    }

    const notification = new NotificationModel({
      title,
      message,
      image: imageUrl,
      userId: userIds,
      readBy: [],
      type,
      recipient: recipientValue,
      scheduledAt: channel === 'in-app' && scheduledAt ? new Date(scheduledAt) : null,
      status: channel === 'in-app' && scheduledAt ? 'pending' : 'sent',
      channel,
    });

    await notification.save();

    await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $push: { notifications: notification._id } }
    );

    if (channel === 'email') {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error('Missing environment variables for email configuration:', {
          GMAIL_USER: !!process.env.GMAIL_USER,
          GMAIL_PASS: !!process.env.GMAIL_PASS,
        });
        notification.status = 'failed';
        await notification.save();
        return res.status(500).json({ message: 'Email configuration error: Missing environment variables' });
      }

      if (emailAddresses.length === 0) {
        console.warn('No email addresses found for notification');
        notification.status = 'failed';
        await notification.save();
        return res.status(400).json({ message: 'No recipients found for email' });
      }

      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        // Verify connection first (added for better debugging)
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: emailAddresses.join(','),
          subject: title,
          text: message,
          html: generateEmailTemplate(title, message, imageUrl),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', emailAddresses, 'Message ID:', info.messageId);
      } catch (emailError) {
        console.error('Error sending email:', {
          message: emailError.message,
          stack: emailError.stack,
          response: emailError.response?.data,
        });
        notification.status = 'failed';
        await notification.save();
        return res.status(500).json({ message: 'Failed to send email notification', error: emailError.message });
      }
    } else if (channel === 'in-app' && !scheduledAt) {
      emitNotification(userIds.map(id => id.toString()), notification);
    }

    res.status(201).json({
      message: channel === 'email' ? 'Email notification sent successfully' : (scheduledAt ? 'Notification scheduled successfully' : 'Notification created successfully'),
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({ message: 'Server error while creating notification', error: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const notifications = await NotificationModel
      .find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    const enrichedNotifications = await Promise.all(notifications.map(async (notification) => {
      let recipientDetails = {};
      if (notification.recipient === 'all') {
        recipientDetails = { type: 'all', value: 'All Students' };
      } else if (mongoose.isValidObjectId(notification.recipient)) {
        const course = await CourseModel.findById(notification.recipient);
        if (course) {
          recipientDetails = { type: 'course', value: course.title };
        } else {
          const user = await UserModel.findById(notification.recipient);
          if (user) {
            recipientDetails = { type: 'student', value: user.name };
          }
        }
      }
      return { ...notification.toObject(), recipientDetails };
    }));

    res.status(200).json({
      message: 'All notifications retrieved successfully',
      count: enrichedNotifications.length,
      notifications: enrichedNotifications,
    });
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    res.status(500).json({ message: 'Server error while fetching all notifications', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const notificationId = req.params.id;
    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.image) {
      await deleteFromCloudinary(notification.image);
    }

    await UserModel.updateMany(
      { notifications: notificationId },
      { $pull: { notifications: notificationId } }
    );

    await NotificationModel.findByIdAndDelete(notificationId);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error while deleting notification', error: error.message });
  }
};

const resendNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const notificationId = req.params.id;
    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.status = 'sent';
    notification.createdAt = new Date();
    notification.readBy = [];
    await notification.save();

    await UserModel.updateMany(
      { _id: { $in: notification.userId } },
      { $push: { notifications: notification._id } }
    );

    if (notification.channel === 'email') {
      const users = await UserModel.find({ _id: { $in: notification.userId } }).select('email');
      const emailAddresses = users.map(user => user.email);

      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error('Missing environment variables for email configuration:', {
          GMAIL_USER: !!process.env.GMAIL_USER,
          GMAIL_PASS: !!process.env.GMAIL_PASS,
        });
        notification.status = 'failed';
        await notification.save();
        return res.status(500).json({ message: 'Email configuration error: Missing environment variables' });
      }

      if (emailAddresses.length === 0) {
        console.warn('No email addresses found for resend');
        notification.status = 'failed';
        await notification.save();
        return res.status(400).json({ message: 'No recipients found for email resend' });
      }

      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        // Verify connection first (added for better debugging)
        await transporter.verify();
        console.log('SMTP connection verified for resend');

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: emailAddresses.join(','),
          subject: notification.title,
          text: notification.message,
          html: generateEmailTemplate(notification.title, notification.message, notification.image),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email resent successfully to:', emailAddresses, 'Message ID:', info.messageId);
      } catch (emailError) {
        console.error('Error resending email:', {
          message: emailError.message,
          stack: emailError.stack,
          response: emailError.response?.data,
        });
        notification.status = 'failed';
        await notification.save();
        return res.status(500).json({ message: 'Failed to resend email notification', error: emailError.message });
      }
    } else {
      emitNotification(notification.userId.map(id => id.toString()), notification);
    }

    res.status(200).json({
      message: 'Notification resent successfully',
      notification,
    });
  } catch (error) {
    console.error('Error resending notification:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({ message: 'Server error while resending notification', error: error.message });
  }
};

export { getNotification, markAsRead, createNotification, getAllNotifications, deleteNotification, resendNotification };