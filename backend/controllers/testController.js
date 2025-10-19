import mongoose from 'mongoose';
import TestModel from '../models/TestModel.js';
import CourseModel from '../models/CourseModel.js';
import QuestionModel from '../models/QuestionModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';

const createTest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const { courseId, testType, examType, title, description, duration, noOfAttempts, marksPerQuestion, isFree, status } = req.body;
    if (!courseId || !testType || !examType || !title) {
      return res.status(400).json({ message: 'courseId, testType, examType, and title are required' });
    }
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (marksPerQuestion !== undefined && (typeof marksPerQuestion !== 'number' || marksPerQuestion < 0)) {
      return res.status(400).json({ message: 'marksPerQuestion must be a non-negative number' });
    }
    const test = new TestModel({
      courseId,
      testType,
      examType,
      title,
      description,
      duration,
      noOfAttempts: noOfAttempts || 1,
      markingScheme: { marksPerQuestion: parseInt(marksPerQuestion) || 1 },
      isFree: isFree || false,
      status: status || 'draft',
      questions: [],
    });
    await test.save();
    await CourseModel.findByIdAndUpdate(courseId, { $push: { tests: test._id } }, { new: true });
    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Server error while creating test', error: error.message });
  }
};

const getAllTest = async (req, res) => {
  try {
    const tests = await TestModel.find().populate('questions');
    res.status(200).json({ message: 'Tests retrieved successfully', tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error while fetching tests', error: error.message });
  }
};

const freeTests = async (req, res) => {
  try {
    const userId = req.user?.userId;
    let tests = await TestModel.find({ isFree: true, status: 'published' }).populate('questions');
    
    if (userId) {
      const enrollments = await EnrollmentModel.find({ userId, status: 'active' })
        .populate('courseId');
      const courseIds = enrollments.map(enrollment => enrollment.courseId._id.toString());
      const paidTests = await TestModel.find({ 
        courseId: { $in: courseIds },
        status: 'published',
        isFree: false 
      }).populate('questions');
      tests = [...tests, ...paidTests];
    }
    
    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const testForACourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;
    
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    const enrollment = await EnrollmentModel.findOne({ 
      userId, 
      courseId, 
      status: 'active' 
    });
    
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not enrolled in this course or course is expired' });
    }
    
    const tests = await TestModel.find({ courseId }).populate('questions');
    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const testDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }
    
    const test = await TestModel.findById(id).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    if (!test.isFree && req.user.role !== 'admin') {
      const enrollment = await EnrollmentModel.findOne({
        userId,
        courseId: test.courseId,
        status: 'active'
      });
      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course or course is expired' });
      }
    }
    
    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }
    const { courseId, questions, marksPerQuestion, ...updateData } = req.body;
    let oldCourseId = null;
    if (courseId) {
      if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const test = await TestModel.findById(id);
      if (test && test.courseId.toString() !== courseId) {
        oldCourseId = test.courseId;
        updateData.courseId = courseId;
      }
    }
    if (marksPerQuestion !== undefined) {
      if (typeof marksPerQuestion !== 'number' || marksPerQuestion < 0) {
        return res.status(400).json({ message: 'marksPerQuestion must be a non-negative number' });
      }
      updateData.markingScheme = { marksPerQuestion: parseInt(marksPerQuestion) };
    }
    if (questions) {
      if (!Array.isArray(questions) || !questions.every(q => mongoose.isValidObjectId(q))) {
        return res.status(400).json({ message: 'Questions must be an array of valid question IDs' });
      }
      updateData.questions = questions;
    }
    const test = await TestModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    if (oldCourseId) {
      await CourseModel.findByIdAndUpdate(oldCourseId, { $pull: { tests: id } }, { new: true });
      await CourseModel.findByIdAndUpdate(courseId, { $push: { tests: id } }, { new: true });
    }
    res.status(200).json({ message: 'Test updated successfully', test });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }
    const test = await TestModel.findById(id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    await QuestionModel.deleteMany({ testId: id });
    await CourseModel.findByIdAndUpdate(test.courseId, { $pull: { tests: id } }, { new: true });
    await TestModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Test and associated questions deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { freeTests, testForACourse, testDetails, createTest, updateTest, deleteTest, getAllTest };