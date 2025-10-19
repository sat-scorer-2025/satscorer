import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Many-to-one with Course
  title: { type: String, required: true },
  link: { type: String, required: true }, // URL to video lecture
}, { timestamps: true });

VideoSchema.index({ courseId: 1 });

const VideoModel = mongoose.models.Video || mongoose.model("Video", VideoSchema);

export default VideoModel;