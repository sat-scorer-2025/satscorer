import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstVisit: {
    type: Date,
    default: Date.now,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  userAgent: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
}, {
  timestamps: true,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
