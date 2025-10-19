import cron from 'node-cron';
import { deleteOldResolvedTickets } from '../controllers/supportController.js';

// Schedule deletion of resolved tickets older than 3 days to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to delete resolved tickets older than 3 days...');
    await deleteOldResolvedTickets();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust to your timezone
});

export default cron;