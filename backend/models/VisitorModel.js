// models/VisitorModel.js
import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  lastVisit: { type: Date, default: Date.now }
}, { timestamps: true });

// Optional: Index for performance
VisitorSchema.index({ ip: 1 });

export default mongoose.model('Visitor', VisitorSchema);