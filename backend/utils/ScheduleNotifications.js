import cron from 'node-cron';
import NotificationModel from '../models/NotificationModel.js';
import { emitNotification } from './Socket.js';

export const scheduleNotifications = (io) => {
  // Run every minute to check for pending notifications
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const notifications = await NotificationModel.find({
        status: 'pending',
        scheduledAt: { $lte: now },
      });

      for (const notification of notifications) {
        notification.status = 'sent';
        await notification.save();

        const userIds = notification.userId.map(id => id.toString());
        emitNotification(userIds, notification);
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  });
};