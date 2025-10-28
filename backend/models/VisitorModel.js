// import mongoose from 'mongoose';

// const VisitorSchema = new mongoose.Schema({
//   ip: { type: String, required: true },
//   lastVisit: { type: Date, default: Date.now }
// }, { timestamps: true });

// const Visitor = mongoose.model('Visitor', VisitorSchema);

// export default Visitor;



// models/VisitorModel.js
import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  lastVisit: { type: Date, default: Date.now }
}, { timestamps: true });

// Handle duplicate key errors gracefully
VisitorSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(); // Ignore duplicate IP
  } else {
    next(error);
  }
});

export default mongoose.model('Visitor', VisitorSchema);