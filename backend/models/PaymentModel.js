import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    paymentDate: { type: Date },
    cashfreeOrderId: { type: String, required: true },
    transactionId: { type: String },
    paymentMethod: { type: String, enum: ['debit card','credit card', 'upi', 'netbanking', 'wallet', 'unknown'], default: 'unknown' },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1 });

const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export default PaymentModel;