import mongoose from 'mongoose';
import TestResultModel from '../models/TestResultModel.js';
import UserModel from '../models/UserModel.js';
import TestModel from '../models/TestModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';

// Submit a new test result (Authenticated users)
const submitTestResult = async (req, res) => {
  try {
    const { testId, answers, completedAt } = req.body;
    const userId = req.user.userId; // From authMiddleware

    // Validate required fields
    if (!testId || !answers || !completedAt) {
      return res.status(400).json({ message: 'testId, answers, and completedAt are required' });
    }

    // Validate IDs
    if (!mongoose.isValidObjectId(testId)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Verify test exists
    const test = await TestModel.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: `Test not found for testId: ${testId}` });
    }

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User not found for userId: ${userId}` });
    }

    // Validate completedAt
    const completedDate = new Date(completedAt);
    if (isNaN(completedDate.getTime())) {
      return res.status(400).json({ message: 'completedAt must be a valid date' });
    }

    // Validate answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    if (answers.length === 0) {
      return res.status(400).json({ message: 'At least one answer is required' });
    }

    // Fetch all questions for the test
    const questionIds = test.questions.map(q => q._id.toString());
    let correctCount = 0;
    const marksPerQuestion = test.markingScheme.marksPerQuestion || 1;

    for (const answer of answers) {
      if (!mongoose.isValidObjectId(answer.questionId)) {
        return res.status(400).json({ message: `Invalid question ID: ${answer.questionId}` });
      }

      // Check if question belongs to the test
      if (!questionIds.includes(answer.questionId)) {
        return res.status(400).json({ message: `Question ${answer.questionId} not found or does not belong to test ${testId}` });
      }

      // Find the question for type validation and answer checking
      const question = test.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) {
        return res.status(400).json({ message: `Question ${answer.questionId} not found in test ${testId}` });
      }

      // Validate selectedAnswer based on question type
      if (question.type === 'mcq' && typeof answer.selectedAnswer !== 'string') {
        return res.status(400).json({ message: `selectedAnswer for MCQ must be a string for question ${answer.questionId}` });
      }

      if (question.type === 'checkbox' && !Array.isArray(answer.selectedAnswer)) {
        return res.status(400).json({ message: `selectedAnswer for checkbox must be an array for question ${answer.questionId}` });
      }

      if ((question.type === 'short' || question.type === 'paragraph') && typeof answer.selectedAnswer !== 'string') {
        return res.status(400).json({ message: `selectedAnswer for ${question.type} must be a string for question ${answer.questionId}` });
      }

      // Check if the answer is correct
      if (question.type === 'mcq' || question.type === 'short' || question.type === 'paragraph') {
        if (answer.selectedAnswer === question.correctAnswer) {
          correctCount += 1;
        }
      } else if (question.type === 'checkbox') {
        const selected = Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer.sort() : [];
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer.sort() : [];
        if (selected.length === correct.length && selected.every((val, idx) => val === correct[idx])) {
          correctCount += 1;
        }
      }
    }

    // Calculate score
    const score = correctCount * marksPerQuestion;
    const totalScore = test.questions.length * marksPerQuestion;

    // Check if user has already taken the test and exceeded attempts
    const previousAttempts = await TestResultModel.countDocuments({ userId, testId });
    if (test.noOfAttempts && previousAttempts >= test.noOfAttempts) {
      return res.status(403).json({ message: `Maximum number of attempts (${test.noOfAttempts}) reached for test ${testId}` });
    }

    // Create test result
    const testResult = new TestResultModel({
      userId,
      testId,
      score,
      totalScore,
      answers,
      completedAt: completedDate
    });

    await testResult.save();

    // Update user and test
    await UserModel.findByIdAndUpdate(userId, { $addToSet: { tests: testResult._id } });
    await TestModel.findByIdAndUpdate(testId, { $addToSet: { results: testResult._id } });

    res.status(201).json({
      message: 'Test result submitted successfully',
      testResult
    });
  } catch (error) {
    console.error('Error submitting test result:', error.message, error);
    res.status(500).json({ message: 'Server error while submitting test result', error: error.message });
  }
};

// Get user's own test results (Authenticated users)
const getResult = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const results = await TestResultModel
      .find({ userId })
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType')
      .populate('answers.questionId', 'text options correctAnswer');

    res.status(200).json({
      message: 'Test results retrieved successfully',
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error fetching user test results:', error);
    res.status(500).json({ message: 'Server error while fetching test results', error: error.message });
  }
};

// Get a specific test result by ID (Admin only)
const getSpecificResult = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const resultId = req.params.id;
    if (!mongoose.isValidObjectId(resultId)) {
      return res.status(400).json({ message: 'Invalid result ID' });
    }

    const result = await TestResultModel
      .findById(resultId)
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType')
      .populate('answers.questionId', 'text options correctAnswer');

    if (!result) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.status(200).json({
      message: 'Test result retrieved successfully',
      result
    });
  } catch (error) {
    console.error('Error fetching specific test result:', error);
    res.status(500).json({ message: 'Server error while fetching test result', error: error.message });
  }
};

// Get all test results (Admin only)
const getAllResult = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const results = await TestResultModel
      .find()
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType')
      .populate('answers.questionId', 'text options correctAnswer');

    res.status(200).json({
      message: 'All test results retrieved successfully',
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error fetching all test results:', error);
    res.status(500).json({ message: 'Server error while fetching all test results', error: error.message });
  }
};

// Get all test results for a specific user (Admin only)
const getResultForAUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const results = await TestResultModel
      .find({ userId })
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType')
      .populate('answers.questionId', 'text options correctAnswer');

    res.status(200).json({
      message: 'Test results for user retrieved successfully',
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error fetching test results for user:', error);
    res.status(500).json({ message: 'Server error while fetching test results', error: error.message });
  }
};

// Delete a test result (Admin only)
const deleteTestResult = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const resultId = req.params.id;
    if (!mongoose.isValidObjectId(resultId)) {
      return res.status(400).json({ message: 'Invalid result ID' });
    }

    const result = await TestResultModel.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    await UserModel.findByIdAndUpdate(result.userId, { $pull: { tests: result._id } });
    await TestModel.findByIdAndUpdate(result.testId, { $pull: { results: result._id } });
    await TestResultModel.findByIdAndDelete(resultId);

    res.status(200).json({ message: 'Test result deleted successfully' });
  } catch (error) {
    console.error('Error deleting test result:', error);
    res.status(500).json({ message: 'Server error while deleting test result', error: error.message });
  }
};

// Get test review data for a specific test (Authenticated users - Student)
const getReviewData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const testId = req.params.testId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!mongoose.isValidObjectId(testId)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }

    const test = await TestModel.findById(testId).populate('questions');
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

    const result = await TestResultModel
      .findOne({ userId, testId })
      .sort({ completedAt: -1 })
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType')
      .populate('answers.questionId', 'text options correctAnswer explanation image');

    if (!result) {
      return res.status(404).json({ message: 'No test result found for this user and test' });
    }

    const totalPossibleMarks = result.totalScore;

    res.status(200).json({
      message: 'Test review data retrieved successfully',
      test,
      result,
      totalPossibleMarks
    });
  } catch (error) {
    console.error('Error fetching test review data:', error);
    res.status(500).json({ message: 'Server error while fetching test review data', error: error.message });
  }
};

// Get test review data for a specific test result (Admin only)
const getAdminReviewData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const resultId = req.params.resultId;
    if (!mongoose.isValidObjectId(resultId)) {
      return res.status(400).json({ message: 'Invalid result ID' });
    }

    const result = await TestResultModel
      .findById(resultId)
      .populate('userId', 'name email')
      .populate('testId', 'title testType examType courseId')
      .populate('answers.questionId', 'text options correctAnswer explanation image');

    if (!result) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    const test = await TestModel.findById(result.testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const totalPossibleMarks = result.totalScore;

    res.status(200).json({
      message: 'Test review data retrieved successfully',
      test,
      result,
      totalPossibleMarks
    });
  } catch (error) {
    console.error('Error fetching admin test review data:', error);
    res.status(500).json({ message: 'Server error while fetching test review data', error: error.message });
  }
};

export { submitTestResult, getResult, getSpecificResult, getAllResult, getResultForAUser, deleteTestResult, getReviewData, getAdminReviewData };