import mongoose from "mongoose";
import userModel from "./UserModel.js";

const OtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

OtpSchema.post('deleteOne', { document: true, query: false }, async function(doc) {
  try {
    await userModel.updateOne(
      { _id: doc.userId },
      { $pull: { otps: doc._id } }
    );
  } catch (error) {
    console.error('Error removing OTP reference from User model:', error);
  }
});

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
export default OtpModel;