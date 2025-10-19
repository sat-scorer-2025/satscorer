import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  testType: { type: String, enum: ['Mock Test', 'Topic Test', 'Section Test'], required: true },
  examType: { type: String, enum: ['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP'], required: true },
  title: { type: String, unique: true, required: true },
  description: { type: String },
  duration: { type: Number },
  noOfAttempts: { type: Number, default: 1 },
  markingScheme: {
    marksPerQuestion: { type: Number, default: 1, min: [0, 'Marks per question cannot be negative'] },
  },
  isFree: { type: Boolean, default: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' }],
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

TestSchema.index({ courseId: 1 });

const TestModel = mongoose.models.Test || mongoose.model("Test", TestSchema);
export default TestModel;