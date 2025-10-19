import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfileAvatar from './ProfileAvatar';
import { UserIcon, EmailIcon, LockIcon, CameraIcon } from './Icons';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProfileEditDialog = ({ isOpen, onClose, profileData, setProfileData, token }) => {
  const [formData, setFormData] = useState({
    ...profileData,
    password: '',
    confirmPassword: '',
    profilePhotoFile: null,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhotoFile: file,
      profilePhoto: file ? URL.createObjectURL(file) : formData.profilePhoto,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('email', formData.email);
      updateData.append('phone', formData.phone);
      updateData.append('address', formData.address);
      updateData.append('dateOfBirth', formData.dateOfBirth);
      if (formData.password) updateData.append('password', formData.password);
      if (formData.profilePhotoFile) updateData.append('profilePhoto', formData.profilePhotoFile);

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message === 'Profile updated successfully') {
        setProfileData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          address: response.data.user.address,
          dateOfBirth: response.data.user.dateOfBirth ? new Date(response.data.user.dateOfBirth).toISOString().split('T')[0] : '',
          profilePhoto: response.data.user.profilePhoto,
        });
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out"
            aria-label="Close edit profile modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <ProfileAvatar src={formData.profilePhoto} alt={formData.name} size="large" />
              <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-sm hover:bg-blue-700 transition-all duration-200">
                <CameraIcon className="w-4 h-4" />
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="w-5 h-5 text-blue-600 mr-2" /> Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm ${errors.name ? 'border-red-500' : ''}`}
                type="text"
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <EmailIcon className="w-5 h-5 text-blue-600 mr-2" /> Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm ${errors.email ? 'border-red-500' : ''}`}
                type="email"
                placeholder="Your Email"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="w-5 h-5 text-blue-600 mr-2" /> Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm"
                type="tel"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="w-5 h-5 text-blue-600 mr-2" /> Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm"
                type="text"
                placeholder="Address"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="w-5 h-5 text-blue-600 mr-2" /> Date of Birth
              </label>
              <input
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm"
                type="date"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <LockIcon className="w-5 h-5 text-blue-600 mr-2" /> Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm ${errors.password ? 'border-red-500' : ''}`}
                type="password"
                placeholder="New Password (leave blank to keep current)"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <LockIcon className="w-5 h-5 text-blue-600 mr-2" /> Confirm Password
              </label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
                type="password"
                placeholder="Confirm New Password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all duration-200"
              aria-label="Cancel profile edit"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              aria-label="Save profile changes"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditDialog;