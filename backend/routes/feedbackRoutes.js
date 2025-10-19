import express from "express"
import { submitFeedback, getFeedback, getAllFeedback, deleteFeedback } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const feedbackRouter = express.Router();

feedbackRouter.post('/',authMiddleware, submitFeedback );
feedbackRouter.get('/feedback',authMiddleware, getFeedback );

feedbackRouter.get('/',authMiddleware, getAllFeedback );
feedbackRouter.delete('/:id',authMiddleware, deleteFeedback );

export default feedbackRouter