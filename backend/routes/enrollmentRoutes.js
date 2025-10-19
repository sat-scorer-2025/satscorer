import express from 'express';
import {
  enrollInCourse,
  getStudentEnrollment,
  getAllEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
} from '../controllers/enrollmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const enrollmentRouter = express.Router();

enrollmentRouter.post('/', authMiddleware, enrollInCourse);
enrollmentRouter.get('/myenrollment', authMiddleware, getStudentEnrollment);
enrollmentRouter.get('/', authMiddleware, getAllEnrollment);
enrollmentRouter.put('/:id', authMiddleware, updateEnrollmentStatus);
enrollmentRouter.delete('/:id', authMiddleware, deleteEnrollment);

export default enrollmentRouter;
