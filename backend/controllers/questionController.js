import mongoose from 'mongoose';
import QuestionModel from '../models/QuestionModel.js';
import TestModel from '../models/TestModel.js';

const createQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const questionsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdQuestions = [];

    const batchSize = 10;
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const batch = questionsData.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ testId, text, type, options, correctAnswer, explanation, image }) => {
        if (!testId || !text?.trim() || !type) {
          throw new Error('testId, text, and type are required for all questions');
        }
        if (!mongoose.isValidObjectId(testId)) {
          throw new Error('Invalid test ID');
        }
        const test = await TestModel.findById(testId);
        if (!test) {
          throw new Error('Test not found');
        }
        if (!['mcq', 'checkbox', 'short', 'paragraph'].includes(type)) {
          throw new Error('Invalid question type');
        }
        if (type === 'mcq' || type === 'checkbox') {
          if (!options || !Array.isArray(options) || options.length < 2) {
            throw new Error('At least two options are required for mcq or checkbox');
          }
          if (!correctAnswer || (type === 'checkbox' && (!Array.isArray(correctAnswer) || correctAnswer.length === 0))) {
            throw new Error('correctAnswer is required and must be non-empty for mcq or checkbox');
          }
          for (const opt of options) {
            if (!opt.text || typeof opt.text !== 'string' || opt.text.trim() === '') {
              throw new Error('Each option must have a non-empty text field');
            }
            if (opt.image && typeof opt.image !== 'string') {
              throw new Error('Option image must be a valid URL string');
            }
          }
          if (type === 'checkbox' && Array.isArray(correctAnswer)) {
            const validAnswers = correctAnswer.filter((ans) => options.some((opt) => opt.text === ans));
            if (validAnswers.length === 0) {
              throw new Error('At least one correct answer must match an option text');
            }
            correctAnswer = validAnswers;
          } else if (type === 'mcq' && typeof correctAnswer === 'string' && correctAnswer.trim() !== '') {
            if (!options.some((opt) => opt.text === correctAnswer)) {
              throw new Error('correctAnswer must match one of the option texts');
            }
          } else {
            throw new Error('Invalid correctAnswer format for question type');
          }
        } else if (type === 'short' || type === 'paragraph') {
          if (correctAnswer && typeof correctAnswer !== 'string') {
            throw new Error('correctAnswer must be a string for short or paragraph questions');
          }
        }
        if (image && typeof image !== 'string') {
          throw new Error('Question image must be a valid URL string');
        }
        const question = new QuestionModel({
          testId,
          text: text.trim(),
          type,
          options: type === 'mcq' || type === 'checkbox' ? options.map((opt) => ({
            text: opt.text.trim(),
            image: opt.image || undefined,
          })) : [],
          correctAnswer: correctAnswer || undefined,
          explanation: explanation?.trim() || undefined,
          image: image || undefined,
        });
        await question.save();
        await TestModel.findByIdAndUpdate(testId, {
          $addToSet: { questions: question._id },
        });
        return question;
      });

      const batchResults = await Promise.all(batchPromises);
      createdQuestions.push(...batchResults);
    }

    res.status(201).json({ message: 'Questions created successfully', questions: createdQuestions });
  } catch (error) {
    console.error('Error creating questions:', error.message);
    res.status(400).json({ message: error.message || 'Failed to create questions' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const questionId = req.params.id;
    if (!mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }
    const { testId, text, type, options, correctAnswer, explanation, image } = req.body;
    const updateData = {};
    let newTestId = testId;
    if (testId) {
      if (!mongoose.isValidObjectId(testId)) {
        return res.status(400).json({ message: 'Invalid test ID' });
      }
      const test = await TestModel.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
      updateData.testId = testId;
    }
    if (text) updateData.text = text.trim();
    if (type) {
      if (!['mcq', 'checkbox', 'short', 'paragraph'].includes(type)) {
        return res.status(400).json({ message: 'Invalid question type' });
      }
      updateData.type = type;
    }
    if (options) {
      if (!Array.isArray(options)) {
        return res.status(400).json({ message: 'Options must be an array of objects with text' });
      }
      for (const opt of options) {
        if (!opt.text || typeof opt.text !== 'string' || opt.text.trim() === '') {
          return res.status(400).json({ message: 'Each option must have a non-empty text field' });
        }
        if (opt.image && typeof opt.image !== 'string') {
          return res.status(400).json({ message: 'Option image must be a valid URL string' });
        }
      }
      updateData.options = options.map((opt) => ({
        text: opt.text.trim(),
        image: opt.image || undefined,
      }));
    }
    if (correctAnswer !== undefined) {
      if (type === 'mcq' || type === 'checkbox') {
        if (!correctAnswer || (type === 'checkbox' && (!Array.isArray(correctAnswer) || correctAnswer.length === 0))) {
          return res.status(400).json({ message: 'correctAnswer is required and must be non-empty' });
        }
        const currentOptions = options || (await QuestionModel.findById(questionId))?.options || [];
        if (type === 'checkbox' && Array.isArray(correctAnswer)) {
          const validAnswers = correctAnswer.filter((ans) => currentOptions.some((opt) => opt.text === ans));
          if (validAnswers.length === 0) {
            return res.status(400).json({ message: 'At least one correct answer must match an option text' });
          }
          updateData.correctAnswer = validAnswers;
        } else if (type === 'mcq' && typeof correctAnswer === 'string' && currentOptions.length > 0 && !currentOptions.some((opt) => opt.text === correctAnswer)) {
          return res.status(400).json({ message: 'correctAnswer must match one of the provided or existing option texts' });
        } else if ((type === 'short' || type === 'paragraph') && typeof correctAnswer !== 'string') {
          return res.status(400).json({ message: 'correctAnswer must be a string for short or paragraph questions' });
        } else {
          updateData.correctAnswer = correctAnswer;
        }
      }
    }
    if (explanation !== undefined) updateData.explanation = explanation?.trim() || undefined;
    if (image !== undefined) updateData.image = image;
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('testId', 'title testType examType');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (newTestId && question.testId.toString() !== newTestId) {
      await TestModel.findByIdAndUpdate(question.testId, { $pull: { questions: question._id } });
      await TestModel.findByIdAndUpdate(newTestId, { $addToSet: { questions: question._id } });
    } else if (!question.testId.questions.includes(question._id)) {
      await TestModel.findByIdAndUpdate(question.testId, { $addToSet: { questions: question._id } });
    }
    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(400).json({ message: error.message || 'Failed to update question' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const testId = req.params.testId;
    if (!mongoose.isValidObjectId(testId)) {
      return res.status(400).json({ message: 'Invalid test ID' });
    }
    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    const questions = await QuestionModel.find({ testId }).populate('testId', 'title testType examType');
    res.status(200).json({ message: 'Questions retrieved successfully', count: questions.length, questions });
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ message: 'Server error while fetching questions', error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const questionId = req.params.id;
    if (!mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await TestModel.findByIdAndUpdate(question.testId, { $pull: { questions: question._id } });
    await QuestionModel.findByIdAndDelete(questionId);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(500).json({ message: 'Server error while deleting question', error: error.message });
  }
};

export { createQuestion, getQuestions, updateQuestion, deleteQuestion };
