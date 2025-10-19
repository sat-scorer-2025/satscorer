import express from 'express'
import { getSessionForACourse, createSession, getAllSession, getRelevantSessions, updateSession, deleteSession } from '../controllers/liveSessionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const liveSessionRouter = express.Router();

liveSessionRouter.get('/course/:courseId',authMiddleware, getSessionForACourse );
liveSessionRouter.get("/relevant", authMiddleware, getRelevantSessions);
liveSessionRouter.post('/',authMiddleware, createSession );
liveSessionRouter.get('/',authMiddleware, getAllSession );
liveSessionRouter.put('/:id',authMiddleware, updateSession );
liveSessionRouter.delete('/:id',authMiddleware, deleteSession );

export default liveSessionRouter