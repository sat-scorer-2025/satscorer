import mongoose from 'mongoose';
import EnrollmentModel from '../models/EnrollmentModel.js';
import UserModel from '../models/UserModel.js';
import CourseModel from '../models/CourseModel.js';

// Enroll a user in a course (Authenticated users)
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId; // Use req.user.userId

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    // Validate IDs
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check course status
    if (course.status !== 'published') {
      return res.status(400).json({ message: 'Course is not published' });
    }

    // Check if course has expired
    if (course.endDate && new Date(course.endDate) < new Date()) {
      return res.status(400).json({ message: 'Course enrollment period has ended' });
    }

    // Check maxSeats
    if (course.maxSeats > 0) {
      const enrollmentCount = await EnrollmentModel.countDocuments({ courseId, status: 'active' });
      if (enrollmentCount >= course.maxSeats) {
        return res.status(400).json({ message: 'Course is fully enrolled' });
      }
    }

    // Check if already enrolled
    const existingEnrollment = await EnrollmentModel.findOne({ userId, courseId, status: 'active' });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new EnrollmentModel({
      userId,
      courseId,
      enrolledAt: new Date(),
      status: 'active',
    });

    await enrollment.save();

    // Update UserModel and CourseModel with the new enrollment ID
    await Promise.all([
      UserModel.findByIdAndUpdate(userId, { $push: { enrolledCourses: enrollment._id } }, { new: true }),
      CourseModel.findByIdAndUpdate(courseId, { $push: { enrollments: enrollment._id } }, { new: true }),
    ]);

    res.status(201).json({
      message: 'Enrolled in course successfully',
      enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error while enrolling in course', error: error.message });
  }
};

// Get user's own enrollments (Authenticated users)
const getStudentEnrollment = async (req, res) => {
  try {
    const userId = req.user.userId; // Use req.user.userId
    console.log('Fetching enrollments for userId:', userId); // Debug

    if (!mongoose.isValidObjectId(userId)) {
      console.error('Invalid userId:', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const enrollments = await EnrollmentModel.find({ userId }) // Remove status: 'active' filter to include all enrollments
      .populate('userId', 'name email')
      .populate('courseId', 'title examType price startDate endDate about thumbnail description')
      .lean();

    console.log('Enrollments found:', enrollments.length); // Debug

    if (!enrollments || enrollments.length === 0) {
      return res.status(200).json({ message: 'No enrollments found for this user', enrollments: [] });
    }

    res.status(200).json({
      message: 'Enrollments retrieved successfully',
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    res.status(500).json({ message: 'Server error while fetching enrollments', error: error.message });
  }
};

// Get all enrollments (Admin only)
const getAllEnrollment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const enrollments = await EnrollmentModel.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title examType price startDate endDate about thumbnail')
      .lean();

    console.log('All enrollments found:', enrollments.length); // Debug

    if (!enrollments || enrollments.length === 0) {
      return res.status(200).json({ message: 'No enrollments found', enrollments: [] });
    }

    res.status(200).json({
      message: 'All enrollments retrieved successfully',
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error('Error fetching all enrollments:', error);
    res.status(500).json({ message: 'Server error while fetching all enrollments', error: error.message });
  }
};

// Update enrollment status (Admin only)
const updateEnrollmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const enrollmentId = req.params.id;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }

    if (!status || !['active', 'expired'].includes(status)) {
      return res.status(400).json({ message: 'Status is required and must be active or expired' });
    }

    const enrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentId,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('courseId', 'title examType price startDate endDate about thumbnail');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json({
      message: 'Enrollment status updated successfully',
      enrollment,
    });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    res.status(500).json({ message: 'Server error while updating enrollment status', error: error.message });
  }
};

// Delete an enrollment (Admin only)
const deleteEnrollment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const enrollmentId = req.params.id;
    if (!mongoose.isValidObjectId(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }

    const enrollment = await EnrollmentModel.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Remove enrollment from user and course
    await Promise.all([
      UserModel.findByIdAndUpdate(enrollment.userId, { $pull: { enrolledCourses: enrollment._id } }),
      CourseModel.findByIdAndUpdate(enrollment.courseId, { $pull: { enrollments: enrollment._id } }),
    ]);

    await EnrollmentModel.findByIdAndDelete(enrollmentId);

    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ message: 'Server error while deleting enrollment', error: error.message });
  }
};

// Function to expire enrollments for courses on or past their endDate
const expireEnrollments = async () => {
  try {
    const today = new Date();
    // Find courses that have expired (endDate <= today)
    const expiredCourses = await CourseModel.find({
      endDate: { $lte: today },
    });

    for (const course of expiredCourses) {
      // Update all active enrollments to expired for this course
      const updatedCount = await EnrollmentModel.updateMany(
        { courseId: course._id, status: 'active' },
        { $set: { status: 'expired' } }
      );
      console.log(`Updated ${updatedCount.modifiedCount} enrollments for expired course ${course._id}`);
    }

    console.log('Expired enrollments updated successfully');
  } catch (error) {
    console.error('Error expiring enrollments:', error);
  }
};

export { enrollInCourse, getStudentEnrollment, getAllEnrollment, updateEnrollmentStatus, deleteEnrollment, expireEnrollments };