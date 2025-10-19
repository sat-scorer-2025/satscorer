import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Many-to-one with Course
  title: { type: String, required: true },
  link: { type: String, required: true }, // URL to notes or books (e.g., Google Drive)
}, { timestamps: true });

NotesSchema.index({ courseId: 1 });

const NotesModel = mongoose.models.Notes || mongoose.model("Notes", NotesSchema);

export default NotesModel;