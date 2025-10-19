import express from 'express';
import { submitTestResult, getResult, getSpecificResult, getAllResult, getResultForAUser, deleteTestResult, getReviewData, getAdminReviewData } from '../controllers/testResultController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const testResultRouter = express.Router();

testResultRouter.post('/', authMiddleware, submitTestResult);
testResultRouter.get('/result', authMiddleware, getResult);
testResultRouter.get('/:id', authMiddleware, getSpecificResult);
testResultRouter.get('/', authMiddleware, getAllResult);
testResultRouter.get('/user/:userId', authMiddleware, getResultForAUser);
testResultRouter.delete('/:id', authMiddleware, deleteTestResult);
testResultRouter.get('/review/:testId', authMiddleware, getReviewData);
testResultRouter.get('/admin-review/:resultId', authMiddleware, getAdminReviewData);

export default testResultRouter;