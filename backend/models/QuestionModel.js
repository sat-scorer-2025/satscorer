import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'checkbox', 'short', 'paragraph'], required: true },
  options: [{
    text: { type: String, required: true },
    image: { type: String }
  }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Allow string or array for checkbox
  explanation: { type: String },
  image: { type: String }
}, { timestamps: true });

QuestionSchema.index({ testId: 1 });

const QuestionModel = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default QuestionModel;
