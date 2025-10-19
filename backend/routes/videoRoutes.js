import express from 'express'
import { getVideoForACourse, createVideo, getAllVideos, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const videoRouter = express.Router();

videoRouter.get('/course/:courseId',authMiddleware, getVideoForACourse );

videoRouter.post('/',authMiddleware, createVideo );
videoRouter.get('/',authMiddleware, getAllVideos );
videoRouter.put('/:id',authMiddleware, updateVideo );
videoRouter.delete('/:id',authMiddleware, deleteVideo );

export default videoRouter