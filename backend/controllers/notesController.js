import mongoose from 'mongoose';
import NotesModel from '../models/NotesModel.js';
import CourseModel from '../models/CourseModel.js';

// Get all notes for a specific course (Public)
const getNotesForACourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        // Verify course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const notes = await NotesModel
            .find({ courseId })
            .populate('courseId', 'title examType');

        res.status(200).json({
            message: 'Notes retrieved successfully',
            count: notes.length,
            notes: notes || []
        });
    } catch (error) {
        console.error('Error fetching notes for course:', error);
        res.status(500).json({ message: 'Server error while fetching notes', error: error.message });
    }
};

// Create a new note (Admin only)
const createNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const { courseId, title, link, content } = req.body;

        // Validate required fields
        if (!courseId || !title || !link) {
            return res.status(400).json({ message: 'courseId, title, and link are required' });
        }

        // Validate courseId
        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        // Verify course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Validate link (basic URL format check)
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (!urlRegex.test(link)) {
            return res.status(400).json({ message: 'Invalid notes link URL' });
        }

        // Create new note
        const note = new NotesModel({
            courseId,
            title,
            link,
            content
        });

        await note.save();

        // Add note to course's notes array
        await CourseModel.findByIdAndUpdate(courseId, { $push: { notes: note._id } });

        res.status(201).json({
            message: 'Note created successfully',
            note
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error while creating note', error: error.message });
    }
};

// Get all notes (Admin only)
const getAllNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const notes = await NotesModel
            .find()
            .populate('courseId', 'title examType');

        res.status(200).json({
            message: 'All notes retrieved successfully',
            count: notes.length,
            notes: notes || []
        });
    } catch (error) {
        console.error('Error fetching all notes:', error);
        res.status(500).json({ message: 'Server error while fetching all notes', error: error.message });
    }
};

// Update a note (Admin only)
const updateNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const noteId = req.params.id;
        if (!mongoose.isValidObjectId(noteId)) {
            return res.status(400).json({ message: 'Invalid note ID' });
        }

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        const { courseId, title, link, content } = req.body;

        // Prepare update object
        const updateData = {};
        if (courseId) {
            if (!mongoose.isValidObjectId(courseId)) {
                return res.status(400).json({ message: 'Invalid course ID' });
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            updateData.courseId = courseId;
        }
        if (title) updateData.title = title;
        if (link) {
            const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
            if (!urlRegex.test(link)) {
                return res.status(400).json({ message: 'Invalid notes link URL' });
            }
            updateData.link = link;
        }
        if (content !== undefined) updateData.content = content;

        const note = await NotesModel
            .findByIdAndUpdate(
                noteId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('courseId', 'title examType');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // If courseId changed, update the notes array in both old and new courses
        if (courseId && note.courseId.toString() !== courseId) {
            await CourseModel.findByIdAndUpdate(note.courseId, { $pull: { notes: note._id } });
            await CourseModel.findByIdAndUpdate(courseId, { $push: { notes: note._id } });
        }

        res.status(200).json({
            message: 'Note updated successfully',
            note
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error while updating note', error: error.message });
    }
};

// Delete a note (Admin only)
const deleteNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const noteId = req.params.id;
        if (!mongoose.isValidObjectId(noteId)) {
            return res.status(400).json({ message: 'Invalid note ID' });
        }

        const note = await NotesModel.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Remove note from course's notes array
        await CourseModel.findByIdAndUpdate(note.courseId, { $pull: { notes: note._id } });

        await NotesModel.findByIdAndDelete(noteId);

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error while deleting note', error: error.message });
    }
};

export { getNotesForACourse, createNotes, getAllNotes, updateNotes, deleteNotes };
