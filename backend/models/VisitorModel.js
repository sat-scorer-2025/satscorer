import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  lastVisit: { type: Date, default: Date.now }
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', VisitorSchema);

export default Visitor;
