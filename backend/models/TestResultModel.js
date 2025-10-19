import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Many-to-one with User
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true }, // Many-to-one with Test
  score: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: { type: mongoose.Schema.Types.Mixed } // Support string or array for different question types
  }],
  completedAt: { type: Date, required: true },
}, { timestamps: true });

TestResultSchema.index({ userId: 1, testId: 1 });

const TestResultModel = mongoose.models.TestResult || mongoose.model("TestResult", TestResultSchema);

export default TestResultModel;