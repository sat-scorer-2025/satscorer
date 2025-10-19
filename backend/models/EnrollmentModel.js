import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired'], required: true },
}, { timestamps: true });

EnrollmentSchema.index({ userId: 1, courseId: 1 });

const EnrollmentModel = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);

export default EnrollmentModel;
