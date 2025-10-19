import express from 'express'
import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const questionRouter = express.Router();

questionRouter.post('/',authMiddleware, createQuestion );
questionRouter.get('/test/:testId',authMiddleware, getQuestions );
questionRouter.put('/:id',authMiddleware, updateQuestion )
questionRouter.delete('/:id',authMiddleware, deleteQuestion )

export default questionRouter