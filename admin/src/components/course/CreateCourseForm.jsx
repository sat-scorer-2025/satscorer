import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { toast } from 'react-toastify';
import CoursePreviewTab from './CoursePreviewTab';
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

const CreateCourseForm = () => {
  const { token } = useAuth();
  const { fetchCourses } = useContext(CourseContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    examType: '',
    price: '',
    thumbnail: null,
    thumbnailPreview: null,
    about: '',
    visibility: false,
    startDate: '',
    endDate: '',
    durationMonths: 0,
    maxSeats: 0,
    unlimitedSeats: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [charCounts, setCharCounts] = useState({ description: 0, about: 0 });

  const examTypes = ['SAT', 'ACT', 'GRE', 'GMAT', 'IELTS', 'AP'];
  const maxDescriptionLength = 500;
  const maxAboutLength = 1000;

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
    setCharCounts({
      description: formData.description.length,
      about: formData.about.length,
    });
  }, [formData.description, formData.about]);

  useEffect(() => {
    return () => {
      if (formData.thumbnailPreview) {
        URL.revokeObjectURL(formData.thumbnailPreview);
      }
    };
  }, [formData.thumbnailPreview]);

  const validateForm = (isPublish) => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Course Title is required';
    if (!formData.examType) newErrors.examType = 'Exam Type is required';
    if (isPublish && !formData.price) newErrors.price = 'Price is required to publish';
    if (formData.description.length > maxDescriptionLength)
      newErrors.description = `Description cannot exceed ${maxDescriptionLength} characters`;
    if (formData.about.length > maxAboutLength)
      newErrors.about = `About cannot exceed ${maxAboutLength} characters`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const preview = file ? URL.createObjectURL(file) : null;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
      thumbnailPreview: preview,
    }));
    setErrors((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleUnlimitedChange = () => {
    setFormData((prev) => ({
      ...prev,
      unlimitedSeats: !prev.unlimitedSeats,
      maxSeats: !prev.unlimitedSeats ? 0 : prev.maxSeats,
    }));
  };

  const handleSaveDraft = async () => {
    if (!validateForm(false)) {
      toast.error('Please fix the errors before saving.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.examType);
    form.append('price', Number(formData.price) || 0);
    form.append('description', formData.description);
    form.append('about', formData.about);
    form.append('visibility', formData.visibility ? 'public' : 'private');
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('maxSeats', formData.unlimitedSeats ? 0 : Number(formData.maxSeats));
    form.append('status', 'draft');
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/course`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Draft saved successfully!');
      await fetchCourses();
      setFormData({
        title: '',
        description: '',
        examType: '',
        price: '',
        thumbnail: null,
        thumbnailPreview: null,
        about: '',
        visibility: false,
        startDate: '',
        endDate: '',
        durationMonths: 0,
        maxSeats: 0,
        unlimitedSeats: false,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(error.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm(true)) {
      toast.error('Please fix the errors before publishing.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.examType);
    form.append('price', Number(formData.price));
    form.append('description', formData.description);
    form.append('about', formData.about);
    form.append('visibility', formData.visibility ? 'public' : 'private');
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('maxSeats', formData.unlimitedSeats ? 0 : Number(formData.maxSeats));
    form.append('status', 'published');
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/course`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Course published successfully!');
      await fetchCourses();
      setFormData({
        title: '',
        description: '',
        examType: '',
        price: '',
        thumbnail: null,
        thumbnailPreview: null,
        about: '',
        visibility: false,
        startDate: '',
        endDate: '',
        durationMonths: 0,
        maxSeats: 0,
        unlimitedSeats: false,
      });
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error(error.response?.data?.message || 'Failed to publish course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Create New Course</h2>
      <div className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Course Title</label>
              <div className="relative">
                <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter course title"
                />
              </div>
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Thumbnail</label>
              <div className="relative p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-all duration-200 bg-white">
                <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Visibility & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Exam Type</label>
              <div className="relative">
                <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={formData.examType}
                  onChange={(e) => handleFieldChange('examType', e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.examType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select Exam</option>
                  {examTypes.map((exam) => (
                    <option key={exam} value={exam}>
                      {exam}
                    </option>
                  ))}
                </select>
              </div>
              {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Price (₹)</label>
              <div className="relative">
                <CurrencyRupeeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter price in ₹"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Visibility</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visibility}
                    onChange={() => handleFieldChange('visibility', !formData.visibility)}
                    className="sr-only"
                  />
                  <div className="relative w-12 h-6 bg-gray-300 rounded-full shadow-sm">
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ease-in-out shadow-sm ${
                        formData.visibility ? 'left-6 bg-blue-500' : 'left-0.5 bg-gray-500'
                      }`}
                    />
                  </div>
                  <span className="ml-3 text-gray-600 font-medium">
                    {formData.visibility ? 'Public' : 'Private'}
                  </span>
                  {formData.visibility ? (
                    <EyeIcon className="w-5 h-5 text-gray-600 ml-2" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5 text-gray-600 ml-2" />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description & About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Description</label>
              <div className="relative">
                <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Brief course description"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {charCounts.description}/{maxDescriptionLength}
              </p>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">About the Course</label>
              <div className="relative">
                <InformationCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                <textarea
                  rows={4}
                  value={formData.about}
                  onChange={(e) => handleFieldChange('about', e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.about ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter subjects, syllabus, structure..."
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {charCounts.about}/{maxAboutLength}
              </p>
              {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
            </div>
          </div>
        </div>

        {/* Schedule & Seats Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule & Seats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Start Date</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
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
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">End Date</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
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
                    value={formData.maxSeats}
                    onChange={(e) => handleFieldChange('maxSeats', Number(e.target.value))}
                    disabled={formData.unlimitedSeats}
                    min="0"
                    className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                      formData.unlimitedSeats
                        ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.unlimitedSeats}
                    onChange={handleUnlimitedChange}
                    className="text-blue-500 focus:ring-blue-500 h-5 w-5 rounded"
                  />
                  <span className="ml-2 text-gray-600 font-medium">Unlimited</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => setShowPreview(true)}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            Preview
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting || !formData.title || !formData.examType || !formData.price}
            className={`px-6 py-3 rounded-md shadow-sm font-semibold transition-all duration-200 ease-in-out ${
              isSubmitting || !formData.title || !formData.examType || !formData.price
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            Publish Course
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Course Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                ✕
              </button>
            </div>
            <CoursePreviewTab formData={formData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseForm;