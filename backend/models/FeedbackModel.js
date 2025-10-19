import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Many-to-one with User
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Many-to-one with Course (optional)
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

FeedbackSchema.index({ userId: 1 });

const FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default FeedbackModel;