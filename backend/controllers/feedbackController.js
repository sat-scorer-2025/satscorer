import mongoose from 'mongoose';
import FeedbackModel from '../models/FeedbackModel.js';
import UserModel from '../models/UserModel.js';
import CourseModel from '../models/CourseModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';

// Submit feedback (Authenticated users)
const submitFeedback = async (req, res) => {
    try {
        const { courseId, message, rating } = req.body;
        const userId = req.user.id; // From authMiddleware

        // Validate required fields
        if (!message) {
            return res.status(400).json({ message: 'message is required' });
        }

        // Validate userId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Verify user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate courseId if provided
        if (courseId) {
            if (!mongoose.isValidObjectId(courseId)) {
                return res.status(400).json({ message: 'Invalid course ID' });
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            // Check if user is enrolled in the course
            const enrollment = await EnrollmentModel.findOne({ userId, courseId, status: 'active' });
            if (!enrollment) {
                return res.status(403).json({ message: 'You must be enrolled in the course to provide feedback' });
            }
        }

        // Validate rating if provided
        if (rating !== undefined) {
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
            }
        }

        // Create feedback
        const feedback = new FeedbackModel({
            userId,
            courseId: courseId || null,
            message,
            rating: rating || null
        });

        await feedback.save();

        // Update user's feedback
        await UserModel.findByIdAndUpdate(userId, { $push: { feedback: feedback._id } });

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error while submitting feedback', error: error.message });
    }
};

// Get user's own feedback (Authenticated users)
const getFeedback = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const feedback = await FeedbackModel
            .find({ userId })
            .populate('userId', 'name email')
            .populate('courseId', 'title examType')
            .sort({ createdAt: -1 });

        if (!feedback || feedback.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this user' });
        }

        res.status(200).json({
            message: 'Feedback retrieved successfully',
            count: feedback.length,
            feedback
        });
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({ message: 'Server error while fetching feedback', error: error.message });
    }
};

// Get all feedback (Admin only)
const getAllFeedback = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const feedback = await FeedbackModel
            .find()
            .populate('userId', 'name email')
            .populate('courseId', 'title examType')
            .sort({ createdAt: -1 });

        if (!feedback || feedback.length === 0) {
            return res.status(404).json({ message: 'No feedback found' });
        }

        res.status(200).json({
            message: 'All feedback retrieved successfully',
            count: feedback.length,
            feedback
        });
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.status(500).json({ message: 'Server error while fetching all feedback', error: error.message });
    }
};

// Delete feedback (Admin only)
const deleteFeedback = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const feedbackId = req.params.id;
        if (!mongoose.isValidObjectId(feedbackId)) {
            return res.status(400).json({ message: 'Invalid feedback ID' });
        }

        const feedback = await FeedbackModel.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Remove feedback from user
        await UserModel.findByIdAndUpdate(feedback.userId, { $pull: { feedback: feedbackId } });

        await FeedbackModel.findByIdAndDelete(feedbackId);

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Server error while deleting feedback', error: error.message });
    }
};

export { submitFeedback, getFeedback, getAllFeedback, deleteFeedback };