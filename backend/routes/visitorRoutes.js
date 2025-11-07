import express from 'express';
import { trackVisitor, getVisitorCount, getVisitorStats } from '../controllers/visitorController.js';

const visitorRouter = express.Router();

// Track a visitor (no authentication required)
visitorRouter.post('/track', trackVisitor);

// Get total unique visitors count (public)
visitorRouter.get('/count', getVisitorCount);

// Get visitor statistics (optional - can add auth middleware if needed)
visitorRouter.get('/stats', getVisitorStats);

export default visitorRouter;
