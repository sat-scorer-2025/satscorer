import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: { type: String },
  password: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  profilePhoto: { type: String },
  exam: { type: String, enum: ['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP', ''] },
  university: { type: String },
  status: { type: String, enum: ['active', 'disabled', 'blocked'], default: 'active' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  support: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Support' }],
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  otps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Otp' }],
}, { timestamps: true });

UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;
