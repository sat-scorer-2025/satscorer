import mongoose from 'mongoose';
import VideoModel from '../models/VideoModel.js';
import CourseModel from '../models/CourseModel.js';

// Get all videos for a specific course (Public)
const getVideoForACourse = async (req, res) => {
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

        const videos = await VideoModel
            .find({ courseId })
            .populate('courseId', 'title examType');

        res.status(200).json({
            message: 'Videos retrieved successfully',
            count: videos.length,
            videos: videos || []
        });
    } catch (error) {
        console.error('Error fetching videos for course:', error);
        res.status(500).json({ message: 'Server error while fetching videos', error: error.message });
    }
};

// Create a new video (Admin only)
const createVideo = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const { courseId, title, link, description, duration } = req.body;

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
            return res.status(400).json({ message: 'Invalid video link URL' });
        }

        // Create new video
        const video = new VideoModel({
            courseId,
            title,
            link,
            description,
            duration
        });

        await video.save();

        // Add video to course's videos array
        await CourseModel.findByIdAndUpdate(courseId, { $push: { videos: video._id } });

        res.status(201).json({
            message: 'Video created successfully',
            video
        });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ message: 'Server error while creating video', error: error.message });
    }
};

// Get all videos (Admin only)
const getAllVideos = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const videos = await VideoModel
            .find()
            .populate('courseId', 'title examType');

        res.status(200).json({
            message: 'All videos retrieved successfully',
            count: videos.length,
            videos: videos || []
        });
    } catch (error) {
        console.error('Error fetching all videos:', error);
        res.status(500).json({ message: 'Server error while fetching all videos', error: error.message });
    }
};

// Update a video (Admin only)
const updateVideo = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const videoId = req.params.id;
        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: 'Invalid video ID' });
        }

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        const { courseId, title, link, description, duration } = req.body;

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
                return res.status(400).json({ message: 'Invalid video link URL' });
            }
            updateData.link = link;
        }
        if (description !== undefined) updateData.description = description;
        if (duration !== undefined) updateData.duration = duration;

        const video = await VideoModel
            .findByIdAndUpdate(
                videoId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('courseId', 'title examType');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // If courseId changed, update the videos array in both old and new courses
        if (courseId && video.courseId.toString() !== courseId) {
            await CourseModel.findByIdAndUpdate(video.courseId, { $pull: { videos: video._id } });
            await CourseModel.findByIdAndUpdate(courseId, { $push: { videos: video._id } });
        }

        res.status(200).json({
            message: 'Video updated successfully',
            video
        });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Server error while updating video', error: error.message });
    }
};

// Delete a video (Admin only)
const deleteVideo = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const videoId = req.params.id;
        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: 'Invalid video ID' });
        }

        const video = await VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Remove video from course's videos array
        await CourseModel.findByIdAndUpdate(video.courseId, { $pull: { videos: video._id } });

        await VideoModel.findByIdAndDelete(videoId);

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Server error while deleting video', error: error.message });
    }
};

export { getVideoForACourse, createVideo, getAllVideos, updateVideo, deleteVideo };
