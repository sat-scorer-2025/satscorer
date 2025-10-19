import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  query: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  response: { type: String },
  resolvedAt: { type: Date }, // Tracks when ticket is marked resolved
}, { timestamps: true });

SupportSchema.index({ userId: 1 });
SupportSchema.index({ status: 1, resolvedAt: 1 }); // Index for efficient querying in cron job

const SupportModel = mongoose.models.Support || mongoose.model("Support", SupportSchema);

export default SupportModel;