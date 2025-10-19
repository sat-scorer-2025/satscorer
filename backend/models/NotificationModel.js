import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String }, // URL to optional image
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Tracks users who have read
  type: { type: String, enum: ['announcement', 'reminder'], required: true },
  recipient: { type: String }, // 'all', course_id, or user_id
  scheduledAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'], 
    default: 'pending' 
  },
  channel: { 
    type: String, 
    enum: ['in-app', 'email'], 
    required: true 
  },
}, { timestamps: true });

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ scheduledAt: 1 });

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default NotificationModel;

