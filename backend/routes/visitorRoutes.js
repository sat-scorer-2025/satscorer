import express from 'express';
import { logVisitor, getVisitorCount } from '../controllers/visitorController.js';

const router = express.Router();

router.post('/', logVisitor);
router.get('/count', getVisitorCount);

export default router;
