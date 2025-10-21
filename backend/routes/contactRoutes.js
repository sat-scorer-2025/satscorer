// routes/contactRoutes.js
import express from "express";
import { sendContactMail } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact/send
router.post("/send", sendContactMail);

export default router;
