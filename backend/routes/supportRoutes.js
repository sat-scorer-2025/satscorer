import express from "express"
import { createSupportTicket, getAllSupportTicket, getSupportTicket, updateSupportTicket, deleteSupportTicket } from "../controllers/supportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const supportRouter = express.Router();

supportRouter.post('/',authMiddleware, createSupportTicket );
supportRouter.get('/ticket',authMiddleware, getSupportTicket );

supportRouter.get('/',authMiddleware, getAllSupportTicket );
supportRouter.put('/:id',authMiddleware, updateSupportTicket );
supportRouter.delete('/:id',authMiddleware, deleteSupportTicket );

export default supportRouter