import mongoose from 'mongoose';
import courseModel from '../models/CourseModel.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';


// Get All Published Courses (Public / Student Panel)
const getAllPublishedCourses = async (req, res) => {
  try {
    const today = new Date();

    const courses = await courseModel
      .find({ 
        status: 'published',
        $or: [
          { endDate: { $gte: today } }, // endDate in future
          { endDate: { $exists: false } } // or no endDate (open course)
        ]
      })
      .select('-enrollments')
      .populate('tests videos notes liveSessions');

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No active published courses found' });
    }

    res.status(200).json({
      message: 'Active published courses retrieved successfully',
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Error fetching published courses:', error);
    res.status(500).json({ message: 'Server error while fetching published courses', error: error.message });
  }
};

// Get Course by ID (Public)
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await courseModel
      .findById(courseId)
      .populate('tests videos notes liveSessions enrollments');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course retrieved successfully',
      course,
    });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Server error while fetching course by id', error: error.message });
  }
};

// Create Course (Admin only)
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const { title, description, examType, price, about, visibility, startDate, endDate, maxSeats, status } = req.body;

    if (!title || !examType || !price) {
      return res.status(400).json({ message: 'Title, examType, and price are required' });
    }

    if (!['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP'].includes(examType)) {
      return res.status(400).json({ message: 'Invalid exam type' });
    }

    if (visibility && !['private', 'public'].includes(visibility)) {
      return res.status(400).json({ message: 'Invalid visibility status' });
    }

    if (status && !['published', 'draft'].includes(status)) {
      return res.status(400).json({ message: 'Invalid course status' });
    }

    let thumbnailUrl = '';
    if (req.file) {
      try {
        thumbnailUrl = await uploadToCloudinary(req.file.path, 'SATscorer/course_thumbnails');
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading thumbnail', error: uploadError.message });
      }
    }

    const course = new courseModel({
      title,
      description,
      examType,
      price,
      thumbnail: thumbnailUrl,
      about,
      visibility: visibility || 'public',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      maxSeats: maxSeats || 0,
      status: status || 'draft',
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error while creating course', error: error.message });
  }
};

// Update Course (Admin only)
const updateCourse = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const courseId = req.params.id;
    const { title, description, examType, price, about, visibility, startDate, endDate, maxSeats, status } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (examType) {
      if (!['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP'].includes(examType)) {
        return res.status(400).json({ message: 'Invalid exam type' });
      }
      updateData.examType = examType;
    }
    if (price) updateData.price = price;
    if (about) updateData.about = about;
    if (visibility) {
      if (!['private', 'public'].includes(visibility)) {
        return res.status(400).json({ message: 'Invalid visibility status' });
      }
      updateData.visibility = visibility;
    }
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (maxSeats !== undefined) updateData.maxSeats = maxSeats;
    if (status) {
      if (!['published', 'draft'].includes(status)) {
        return res.status(400).json({ message: 'Invalid course status' });
      }
      updateData.status = status;
    }

    if (req.file) {
      try {
        // Upload new thumbnail to Cloudinary
        updateData.thumbnail = await uploadToCloudinary(req.file.path, 'SATscorer/course_thumbnails');
        // Delete old thumbnail from Cloudinary if it exists
        const oldCourse = await courseModel.findById(courseId);
        if (oldCourse && oldCourse.thumbnail) {
          await deleteFromCloudinary(oldCourse.thumbnail);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading thumbnail', error: uploadError.message });
      }
    }

    const course = await courseModel
      .findByIdAndUpdate(courseId, { $set: updateData }, { new: true, runValidators: true })
      .populate('tests videos notes liveSessions enrollments');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error while updating course', error: error.message });
  }
};


// Delete Course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const today = new Date();
    const isExpired = course.endDate && new Date(course.endDate) < today;
    const hasNoEnrollments = !course.enrollments || course.enrollments.length === 0;

    if (!isExpired && !hasNoEnrollments) {
      return res.status(400).json({ 
        message: 'Course cannot be deleted. It must be expired or have zero enrollments.' 
      });
    }

    if (course.thumbnail) {
      await deleteFromCloudinary(course.thumbnail);
    }

    await courseModel.findByIdAndDelete(courseId);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error while deleting course', error: error.message });
  }
};

// Get All Courses (Admin only)
const getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const courses = await courseModel.find().populate('tests videos notes liveSessions enrollments');

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.status(200).json({
      message: 'All courses retrieved successfully',
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Error fetching all courses:', error);
    res.status(500).json({ message: 'Server error while fetching all courses', error: error.message });
  }
};

export { getAllPublishedCourses, getCourseById, createCourse, updateCourse, deleteCourse, getAllCourses };