import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  examType: { type: String, enum: ['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP'], required: true },
  price: { type: Number, required: true, min:0 },
  thumbnail: { type: String }, // URL to thumbnail image
  about: { type: String }, // About the batch/course
  visibility: { type: String, enum: ['private', 'public'], default: 'public' },
  startDate: { type: Date },
  endDate: { type: Date },
  maxSeats: { type: Number, default: 0 }, // 0 for unlimited
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }], // One-to-many with Test
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // One-to-many with Video
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }], // One-to-many with Notes
  liveSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LiveSession' }], // One-to-many with LiveSession
  enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }], // Many-to-many with User via Enrollment
  support: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Support' }], // One-to-many with Support
}, { timestamps: true });

const CourseModel = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default CourseModel;