import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { BookOpenIcon, PencilSquareIcon, CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

const EditSessionDialog = () => {
  const { token } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();
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
  const [sessionNotFound, setSessionNotFound] = useState(false);

  useEffect(() => {
    const session = sessions.find((s) => s._id === sessionId);
    if (session) {
      setFormData({
        courseId: session.courseId?._id || session.courseId || '',
        title: session.title || '',
        description: session.description || '',
        date: new Date(session.scheduledAt).toISOString().split('T')[0] || '',
        time: new Date(session.scheduledAt).toTimeString().slice(0, 5) || '',
        platform: ['Google Meet', 'Zoom', 'Microsoft Teams'].includes(session.platform) ? session.platform : 'Other',
        customPlatform: ['Google Meet', 'Zoom', 'Microsoft Teams'].includes(session.platform) ? '' : session.platform,
        link: session.link || '',
      });
      setSessionNotFound(false);
    } else {
      console.warn('Session not found for ID:', sessionId);
      setSessionNotFound(true);
    }
  }, [sessionId, sessions]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (formData.platform === 'Other' && !formData.customPlatform.trim()) newErrors.customPlatform = 'Platform name is required';
    if (!formData.link.trim()) newErrors.link = 'Meeting link is required';
    if (formData.link && !isValidURL(formData.link)) {
      newErrors.link = 'Please enter a valid meeting link (must start with http:// or https://)';
    }
    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
    if (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
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
    try {
      const sessionData = {
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        scheduledAt: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        platform: formData.platform === 'Other' ? formData.customPlatform : formData.platform,
        link: formData.link,
      };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/livesession/${sessionId}`,
        sessionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(sessions.map((s) => (s._id === sessionId ? response.data.session : s)));
      toast.success('Session updated successfully!');
      navigate('/live/manage');
    } catch (error) {
      const errorMsg = error.response?.data?.fields
        ? Object.values(error.response.data.fields).filter(Boolean).join(', ')
        : error.response?.data?.message || error.message;
      toast.error(`Failed to update session: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate('/live/manage');
  };

  if (sessionNotFound) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm">The session you are trying to edit does not exist.</p>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              Back to Manage Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Edit Live Session</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-8">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {Object.values(errors).map((err, idx) => (
                <p key={idx} className="text-sm">{err}</p>
              ))}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Course</label>
                <div className="relative">
                  <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleChange('courseId', e.target.value)}
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
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
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
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Details</h3>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Description</label>
              <div className="relative">
                <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
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
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
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
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
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
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Platform</label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={formData.platform}
                    onChange={(e) => handleChange('platform', e.target.value)}
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
                        value={formData.customPlatform}
                        onChange={(e) => handleChange('customPlatform', e.target.value)}
                        placeholder="Enter platform name"
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
                    value={formData.link}
                    onChange={(e) => handleChange('link', e.target.value)}
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
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-all duration-200 ease-in-out disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-md shadow-sm font-semibold transition-all duration-200 ease-in-out ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSessionDialog;