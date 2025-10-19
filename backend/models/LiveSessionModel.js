import mongoose from "mongoose";

const LiveSessionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Many-to-one with Course
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  link: { type: String, required: true }, // URL to platform (e.g., Google Meet)
  platform: { type: String, required: true }, // e.g., Google Meet, Zoom
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed'], 
    default: 'scheduled' 
  }, // Status field added
}, { timestamps: true });

LiveSessionSchema.index({ courseId: 1 });

const LiveSessionModel = mongoose.models.LiveSession || mongoose.model("LiveSession", LiveSessionSchema);

export default LiveSessionModel;
