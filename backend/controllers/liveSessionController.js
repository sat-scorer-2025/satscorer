import mongoose from 'mongoose';
import LiveSessionModel from '../models/LiveSessionModel.js';
import CourseModel from '../models/CourseModel.js';

// Get all live sessions for a specific course (Public)
const getSessionForACourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID', field: 'courseId' });
        }

        // Verify course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found', field: 'courseId' });
        }

        const sessions = await LiveSessionModel
            .find({ courseId })
            .populate('courseId', 'title examType')
            .sort({ scheduledAt: 1 }); // Sort by scheduledAt ascending

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No live sessions found for this course' });
        }

        res.status(200).json({
            message: 'Live sessions retrieved successfully',
            count: sessions.length,
            sessions
        });
    } catch (error) {
        console.error('Error fetching live sessions for course:', error);
        res.status(500).json({ message: 'Server error while fetching live sessions', error: error.message });
    }
};

// Create a new live session (Admin only)
const createSession = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const { courseId, title, description, scheduledAt, link, platform, status } = req.body;

        // Validate required fields
        if (!courseId || !title || !scheduledAt || !link || !platform) {
            return res.status(400).json({ 
                message: 'Missing required fields', 
                fields: { 
                    courseId: !courseId ? 'Course ID is required' : undefined,
                    title: !title ? 'Title is required' : undefined,
                    scheduledAt: !scheduledAt ? 'Scheduled date is required' : undefined,
                    link: !link ? 'Link is required' : undefined,
                    platform: !platform ? 'Platform is required' : undefined
                }
            });
        }

        // Validate courseId
        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID', field: 'courseId' });
        }

        // Verify course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found', field: 'courseId' });
        }

        // Validate scheduledAt (must be a valid date)
        const scheduleDate = new Date(scheduledAt);
        if (isNaN(scheduleDate.getTime())) {
            return res.status(400).json({ message: 'Invalid scheduled date', field: 'scheduledAt' });
        }

        // Validate link (basic URL format check)
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (!urlRegex.test(link)) {
            return res.status(400).json({ message: 'Invalid session link URL. Must start with http:// or https://', field: 'link' });
        }

        // Validate platform (allow any non-empty string)
        if (typeof platform !== 'string' || platform.trim() === '') {
            return res.status(400).json({ message: 'Platform must be a non-empty string', field: 'platform' });
        }

        // Validate status if provided
        if (status && !['scheduled', 'ongoing', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status', field: 'status' });
        }

        // Create new live session
        const session = new LiveSessionModel({
            courseId,
            title,
            description,
            scheduledAt: scheduleDate,
            link,
            platform,
            status: status || 'scheduled' // Default to 'scheduled' if not provided
        });

        await session.save();

        // Add session to course's liveSessions array
        await CourseModel.findByIdAndUpdate(courseId, { $push: { liveSessions: session._id } });

        res.status(201).json({
            message: 'Live session created successfully',
            session
        });
    } catch (error) {
        console.error('Error creating live session:', error);
        res.status(500).json({ message: 'Server error while creating live session', error: error.message });
    }
};

// Get all live sessions (Admin only)
const getAllSession = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const sessions = await LiveSessionModel
            .find()
            .populate('courseId', 'title examType')
            .sort({ scheduledAt: 1 });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No live sessions found' });
        }

        res.status(200).json({
            message: 'All live sessions retrieved successfully',
            count: sessions.length,
            sessions
        });
    } catch (error) {
        console.error('Error fetching all live sessions:', error);
        res.status(500).json({ message: 'Server error while fetching all live sessions', error: error.message });
    }
};

// Update a live session (Admin only)
const updateSession = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const sessionId = req.params.id;
        if (!mongoose.isValidObjectId(sessionId)) {
            return res.status(400).json({ message: 'Invalid session ID', field: 'sessionId' });
        }

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        const { courseId, title, description, scheduledAt, link, platform, status } = req.body;

        // Fetch the original session to get the current courseId
        const originalSession = await LiveSessionModel.findById(sessionId);
        if (!originalSession) {
            return res.status(404).json({ message: 'Live session not found', field: 'sessionId' });
        }

        // Prepare update object
        const updateData = {};
        if (courseId) {
            if (!mongoose.isValidObjectId(courseId)) {
                return res.status(400).json({ message: 'Invalid course ID', field: 'courseId' });
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found', field: 'courseId' });
            }
            updateData.courseId = courseId;
        }
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (scheduledAt) {
            const scheduleDate = new Date(scheduledAt);
            if (isNaN(scheduleDate.getTime())) {
                return res.status(400).json({ message: 'Invalid scheduled date', field: 'scheduledAt' });
            }
            updateData.scheduledAt = scheduleDate;
        }
        if (link) {
            const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
            if (!urlRegex.test(link)) {
                return res.status(400).json({ message: 'Invalid session link URL. Must start with http:// or https://', field: 'link' });
            }
            updateData.link = link;
        }
        if (platform) {
            if (typeof platform !== 'string' || platform.trim() === '') {
                return res.status(400).json({ message: 'Platform must be a non-empty string', field: 'platform' });
            }
            updateData.platform = platform;
        }
        if (status) {
            if (!['scheduled', 'ongoing', 'completed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status', field: 'status' });
            }
            updateData.status = status;
        }

        // Perform the update
        const session = await LiveSessionModel
            .findByIdAndUpdate(
                sessionId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('courseId', 'title examType');

        if (!session) {
            return res.status(404).json({ message: 'Live session not found', field: 'sessionId' });
        }

        // If courseId changed, update the liveSessions array in both old and new courses
        if (courseId && originalSession.courseId.toString() !== courseId) {
            await CourseModel.findByIdAndUpdate(originalSession.courseId, { $pull: { liveSessions: session._id } });
            await CourseModel.findByIdAndUpdate(courseId, { $push: { liveSessions: session._id } });
        }

        res.status(200).json({
            message: 'Live session updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating live session:', error);
        res.status(500).json({ message: 'Server error while updating live session', error: error.message });
    }
};

// Delete a live session (Admin only)
const deleteSession = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const sessionId = req.params.id;
        if (!mongoose.isValidObjectId(sessionId)) {
            return res.status(400).json({ message: 'Invalid session ID', field: 'sessionId' });
        }

        const session = await LiveSessionModel.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Live session not found', field: 'sessionId' });
        }

        // Remove session from course's liveSessions array
        await CourseModel.findByIdAndUpdate(session.courseId, { $pull: { liveSessions: session._id } });

        await LiveSessionModel.findByIdAndDelete(sessionId);

        res.status(200).json({ message: 'Live session deleted successfully' });
    } catch (error) {
        console.error('Error deleting live session:', error);
        res.status(500).json({ message: 'Server error while deleting live session', error: error.message });
    }
};

// Get relevant live sessions (Admin + Users)
const getRelevantSessions = async (req, res) => {
  try {
    const now = new Date();

    // Ongoing sessions = now >= scheduledAt AND now <= scheduledAt + 1hr
    const ongoingSessions = await LiveSessionModel.find({
      scheduledAt: { $lte: now },
      $expr: { $gte: [ { $add: ["$scheduledAt", 1000 * 60 * 60] }, now ] } // scheduledAt + 1hr >= now
    })
      .populate('courseId', 'title examType')
      .sort({ scheduledAt: 1 });

    if (ongoingSessions.length > 0) {
      return res.status(200).json({
        message: "Ongoing live sessions retrieved",
        sessions: ongoingSessions.slice(0, 5)
      });
    }

    // If no ongoing sessions → fetch upcoming
    const upcomingSessions = await LiveSessionModel.find({
      scheduledAt: { $gt: now } // future sessions only
    })
      .populate('courseId', 'title examType')
      .sort({ scheduledAt: 1 }) // soonest first
      .limit(5);

    return res.status(200).json({
      message: "Upcoming live sessions retrieved",
      sessions: upcomingSessions
    });
  } catch (error) {
    console.error("Error fetching relevant sessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { getSessionForACourse, createSession, getAllSession, getRelevantSessions, updateSession, deleteSession };
