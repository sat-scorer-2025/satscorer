import express from "express";
import { getNotification, markAsRead, createNotification, getAllNotifications, deleteNotification, resendNotification } from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const notificationRouter = express.Router();

notificationRouter.get('/notifications', authMiddleware, getNotification);
notificationRouter.put('/read/:id', authMiddleware, markAsRead);
notificationRouter.post('/', authMiddleware, upload.single('image'), createNotification);
notificationRouter.get('/', authMiddleware, getAllNotifications);
notificationRouter.delete('/:id', authMiddleware, deleteNotification);
notificationRouter.post('/resend/:id', authMiddleware, resendNotification);

export default notificationRouter;
