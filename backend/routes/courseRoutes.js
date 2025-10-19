import express from 'express'
import { getAllPublishedCourses, getCourseById, createCourse,updateCourse, deleteCourse, getAllCourses } from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { upload } from '../config/cloudinary.js'

const courseRouter = express.Router();

courseRouter.get('/all',authMiddleware, getAllCourses );

courseRouter.get('/', getAllPublishedCourses );
courseRouter.get('/:id', getCourseById );

courseRouter.post('/',authMiddleware,upload.single('thumbnail'), createCourse );
courseRouter.put('/:id',authMiddleware,upload.single('thumbnail'), updateCourse );
courseRouter.delete('/:id',authMiddleware, deleteCourse );

export default courseRouter