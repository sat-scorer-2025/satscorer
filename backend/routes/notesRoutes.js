import express from 'express'
import { getNotesForACourse, createNotes, getAllNotes, updateNotes, deleteNotes } from '../controllers/notesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const notesRouter = express.Router();

notesRouter.get('/course/:courseId',authMiddleware, getNotesForACourse );

notesRouter.post('/',authMiddleware, createNotes );
notesRouter.get('/',authMiddleware, getAllNotes );
notesRouter.put('/:id',authMiddleware, updateNotes );
notesRouter.delete('/:id',authMiddleware, deleteNotes );

export default notesRouter