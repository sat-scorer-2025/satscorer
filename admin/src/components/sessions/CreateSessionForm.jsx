import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { BookOpenIcon, PencilSquareIcon, CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

const CreateSessionForm = () => {
  const { token } = useAuth();
  const { courses, sessions, setSessions } = useOutletContext();
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    date: '',
    time: '',
    platform: '',
    customPlatform: '',
    link: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.title.trim()) newErrors.title = 'Session title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (formData.platform === 'Other' && !formData.customPlatform.trim()) {
      newErrors.customPlatform = 'Custom platform name is required';
    }
    if (!formData.link.trim()) newErrors.link = 'Meeting link is required';
    if (formData.link && !isValidURL(formData.link)) {
      newErrors.link = 'Please enter a valid meeting link (must start with http:// or https://)';
    }
    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
    if (formData.date && formData.time && (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date())) {
      newErrors.date = 'Scheduled date and time must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(Boolean).join(', ');
      toast.error(`Please fix the following errors: ${errorMessages}`);
      return;
    }

    setIsSubmitting(true);
    const sessionData = {
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      scheduledAt: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
      platform: formData.platform === 'Other' ? formData.customPlatform : formData.platform,
      link: formData.link,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/livesession`, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions([...sessions, response.data.session]);
      toast.success('Session created successfully!');
      setFormData({
        courseId: '',
        title: '',
        description: '',
        date: '',
        time: '',
        platform: '',
        customPlatform: '',
        link: '',
      });
      setErrors({});
    } catch (error) {
      const errorMsg = error.response?.data?.fields
        ? Object.values(error.response.data.fields).filter(Boolean).join(', ')
        : error.response?.data?.message || error.message;
      toast.error(`Failed to create session: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Create New Live Session</h2>
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {Object.values(errors).map((err, idx) => (
            <p key={idx} className="text-sm">{err}</p>
          ))}
        </div>
      )}
      <div className="space-y-8">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Course</label>
              <div className="relative">
                <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.courseId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Course</option>
                  {courses && courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Session Title</label>
              <div className="relative">
                <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter session title"
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
          </div>
        </div>

        {/* Session Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Details</h3>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <div className="relative">
              <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter session description"
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows="4"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Date</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Time</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
        </div>

        {/* Platform Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Platform</label>
              <div className="relative">
                <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.platform ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Platform</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
              {formData.platform === 'Other' && (
                <div className="mt-4">
                  <label className="block text-gray-600 font-medium mb-1">Custom Platform Name</label>
                  <div className="relative">
                    <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="customPlatform"
                      value={formData.customPlatform}
                      onChange={handleChange}
                      placeholder="Enter custom platform name"
                      className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                        errors.customPlatform ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.customPlatform && <p className="text-red-500 text-sm mt-1">{errors.customPlatform}</p>}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Meeting Link</label>
              <div className="relative">
                <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Enter meeting link (e.g., https://meet.google.com/xyz)"
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.link ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md shadow-sm font-semibold transition-all duration-200 ease-in-out ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionForm;