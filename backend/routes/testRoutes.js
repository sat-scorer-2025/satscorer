import express from 'express'
import { freeTests, testForACourse, testDetails, createTest, updateTest, deleteTest, getAllTest } from '../controllers/testController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const testRouter = express.Router();

testRouter.get('/free', freeTests );
testRouter.get('/course/:courseId',authMiddleware, testForACourse );
testRouter.get('/:id',authMiddleware, testDetails );

testRouter.post('/',authMiddleware, createTest );
testRouter.put('/:id',authMiddleware, updateTest );
testRouter.delete('/:id',authMiddleware, deleteTest );
testRouter.get('/',authMiddleware, getAllTest );

export default testRouter