import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, deleteProfile, getUsers, inactiveUsers, userById, updateUserStatus } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('profilePhoto'), registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, upload.single('profilePhoto'), updateProfile);
userRouter.delete('/profile', authMiddleware, deleteProfile);
userRouter.get('/users', authMiddleware, getUsers);
userRouter.get('/inactive', authMiddleware, inactiveUsers);
userRouter.get('/:id', authMiddleware, userById);
userRouter.put('/:id/status', authMiddleware, updateUserStatus);

export default userRouter;
