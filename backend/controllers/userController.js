import userModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { upload } from '../config/cloudinary.js';
import NotificationModel from '../models/NotificationModel.js';
import { emitNotification } from '../utils/Socket.js';

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      dateOfBirth,
      exam,
      university,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let profilePhotoUrl = '';
    if (req.file) {
      try {
        profilePhotoUrl = req.file.path;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading profile photo' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      profilePhoto: profilePhotoUrl,
      exam,
      university,
      role: role || 'student',
      status: 'active',
    });

    await user.save();

    // Find all admin users
    const admins = await userModel.find({ role: 'admin' }).select('_id');
    const adminIds = admins.map(admin => admin._id);

    // Create notification for admins
    const registrationNotification = new NotificationModel({
      title: 'New Student Registers 🔔',
      message: `Student 🧑🏻‍🎓: ${name} [${email}] registered on ${new Date().toLocaleString()}`,
      image: '',
      userId: adminIds,
      readBy: [],
      type: 'announcement',
      recipient: 'admin',
      scheduledAt: null,
      status: 'sent',
      channel: 'in-app',
    });

    await registrationNotification.save();

    // Add notification to admins' notifications array
    await userModel.updateMany(
      { _id: { $in: adminIds } },
      { $push: { notifications: registrationNotification._id } }
    );

    // Emit real-time notification to admins via socket
    emitNotification(adminIds.map(id => id.toString()), registrationNotification);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'You have been blocked by the admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.userId)
      .select('-password')
      .populate('enrolledCourses notifications feedback support tests payments');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      password,
      exam,
      university,
    } = req.body;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (exam) updateData.exam = exam;
    if (university) updateData.university = university;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      try {
        updateData.profilePhoto = req.file.path;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading profile photo' });
      }
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.user.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Profile deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting profile' });
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const query = req.query.role ? { role: req.query.role } : {};
    const users = await userModel
      .find(query)
      .select('-password')
      .populate('enrolledCourses notifications feedback support tests payments');

    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

const inactiveUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const users = await userModel
      .find({ status: { $in: ['disabled', 'blocked'] } })
      .select('-password')
      .populate('enrolledCourses notifications feedback support tests payments');

    res.status(200).json({
      message: 'Inactive users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Inactive users error:', error);
    res.status(500).json({ message: 'Server error while fetching inactive users' });
  }
};

const userById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin privileges required' });

    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await userModel
      .findById(userId)
      .select('-password')
      .populate([
        { path: 'enrolledCourses', populate: { path: 'courseId', select: 'title' } },
        { path: 'tests', populate: { path: 'testId', select: 'title' } },
        { path: 'notifications' },
        { path: 'feedback' },
        { path: 'support' },
        { path: 'payments' },
      ]);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Map enrolledCourses & tests so frontend always gets { _id, title }
    const enrolledCourses = user.enrolledCourses?.map(c => ({
      _id: c._id,
      title: c.courseId?.title || 'N/A'
    })) || [];

    const tests = user.tests?.map(t => ({
      _id: t._id,
      title: t.testId?.title || 'N/A'
    })) || [];

    res.status(200).json({
      message: 'User retrieved successfully',
      user: {
        ...user.toObject(),
        enrolledCourses,
        tests
      }
    });
  } catch (error) {
    console.error('User by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    const userId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!status || !['active', 'disabled', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (active, disabled, or blocked)' });
    }

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: { status } },
        { new: true, runValidators: true }
      )
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User status updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, deleteProfile, getUsers, inactiveUsers, userById, updateUserStatus };