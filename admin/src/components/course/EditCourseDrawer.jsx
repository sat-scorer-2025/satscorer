import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  BookOpenIcon,
  PhotoIcon,
  AcademicCapIcon,
  CurrencyRupeeIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const EditCourseDrawer = ({ course, onClose, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    exam: '',
    price: '',
    thumbnail: null,
    thumbnailPreview: null,
    about: '',
    isPublic: true,
    startDate: '',
    endDate: '',
    durationMonths: 0,
    maxSeats: 0,
    unlimitedSeats: false,
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        id: course._id || '',
        title: course.title || '',
        description: course.description || '',
        exam: course.examType || '',
        price: course.price || '',
        thumbnail: null,
        thumbnailPreview: course.thumbnail || 'https://via.placeholder.com/150',
        about: course.about || '',
        isPublic: course.visibility === 'public',
        startDate: course.startDate ? course.startDate.split('T')[0] : '',
        endDate: course.endDate ? course.endDate.split('T')[0] : '',
        durationMonths: 0,
        maxSeats: course.maxSeats || 0,
        unlimitedSeats: course.maxSeats === 0,
        status: course.status || 'draft',
      });
    }
  }, [course]);

  useEffect(() => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end > start) {
      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (end.getDate() < start.getDate()) {
        months -= 1;
      }
      setFormData((prev) => ({ ...prev, durationMonths: months }));
    } else {
      setFormData((prev) => ({ ...prev, durationMonths: 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    return () => {
      if (formData.thumbnailPreview && formData.thumbnail) {
        URL.revokeObjectURL(formData.thumbnailPreview);
      }
    };
  }, [formData.thumbnailPreview, formData.thumbnail]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const preview = file ? URL.createObjectURL(file) : formData.thumbnailPreview;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
      thumbnailPreview: preview,
    }));
  };

  const handleUnlimitedChange = () => {
    setFormData((prev) => ({
      ...prev,
      unlimitedSeats: !prev.unlimitedSeats,
      maxSeats: !prev.unlimitedSeats ? 0 : '',
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.exam || !formData.price) {
      toast.error('Title, Exam Type, and Price are required.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.exam);
    form.append('price', Number(formData.price).toString());
    form.append('description', formData.description || '');
    form.append('about', formData.about || '');
    form.append('visibility', formData.isPublic ? 'public' : 'private');
    form.append('startDate', formData.startDate || '');
    form.append('endDate', formData.endDate || '');
    form.append('maxSeats', formData.unlimitedSeats ? '0' : Number(formData.maxSeats).toString());
    form.append('status', formData.status);
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/course/${formData.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onUpdate(response.data.course);
      toast.success('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-7xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-semibold transition-colors duration-200"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Course Title</label>
                <div className="relative">
                  <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    placeholder="Enter course title"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Thumbnail</label>
                <div className="relative p-4 border-2 border-dashed border-gray-200 rounded-md hover:border-blue-500 transition-all duration-200">
                  <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-500 text-center">Drag & drop or click to upload</p>
                  {formData.thumbnailPreview && (
                    <img
                      src={formData.thumbnailPreview}
                      alt="Preview"
                      className="mt-4 max-h-32 mx-auto object-contain border border-gray-200 rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility & Pricing Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Visibility & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Exam Type</label>
                <div className="relative">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="exam"
                    value={formData.exam}
                    onChange={(e) => handleFieldChange('exam', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Exam</option>
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                    <option value="GRE">GRE</option>
                    <option value="GMAT">GMAT</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Price (₹)</label>
                <div className="relative">
                  <CurrencyRupeeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    placeholder="Enter price in ₹"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Description</label>
                <div className="relative">
                  <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    placeholder="Brief course description"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">About the Course</label>
                <div className="relative">
                  <InformationCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                  <textarea
                    name="about"
                    rows={4}
                    value={formData.about}
                    onChange={(e) => handleFieldChange('about', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    placeholder="Enter subjects, syllabus, structure..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Visibility</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={() => handleFieldChange('isPublic', !formData.isPublic)}
                  className="sr-only"
                  disabled={isSubmitting}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full shadow-sm">
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ease-in-out shadow-sm ${
                      formData.isPublic ? 'left-6 bg-blue-500' : 'left-0.5 bg-gray-500'
                    }`}
                  />
                </div>
                <span className="ml-3 text-gray-600 font-medium">
                  {formData.isPublic ? 'Public' : 'Private'}
                </span>
                {formData.isPublic ? (
                  <EyeIcon className="w-5 h-5 text-gray-600 ml-2" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5 text-gray-600 ml-2" />
                )}
              </label>
            </div>
          </div>

          {/* Schedule & Seats Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Schedule & Seats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Start Date</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Duration (Months)</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.durationMonths}
                    readOnly
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">End Date</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Max Seats</label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <UsersIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="number"
                      name="maxSeats"
                      value={formData.maxSeats}
                      onChange={(e) => handleFieldChange('maxSeats', Number(e.target.value))}
                      disabled={formData.unlimitedSeats || isSubmitting}
                      min={0}
                      className={`pl-10 w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                        formData.unlimitedSeats ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.unlimitedSeats}
                      onChange={handleUnlimitedChange}
                      className="text-blue-500 focus:ring-blue-500 h-5 w-5 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-gray-600 font-medium">Unlimited</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Status</h3>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                disabled={isSubmitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6 sticky bottom-0 bg-white z-10 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md shadow-sm hover:from-gray-600 hover:to-gray-700 hover:scale-105 transition-all duration-200 ease-in-out disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 ease-in-out disabled:opacity-50"
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

export default EditCourseDrawer;