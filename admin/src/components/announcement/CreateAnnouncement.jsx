import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { PencilSquareIcon, PhotoIcon, UsersIcon, MegaphoneIcon, CalendarIcon } from '@heroicons/react/24/outline';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audienceType, setAudienceType] = useState('all');
  const [audienceValue, setAudienceValue] = useState('all');
  const [type, setType] = useState('announcement');
  const [channel, setChannel] = useState('in-app');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const { token } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { role: 'student', status: 'active' },
      });
      setStudents(response.data.users.map(user => ({
        id: user._id,
        name: user.name || 'Unknown',
        phone: user.phone || 'N/A',
        display: `${user.name || 'Unknown'}${user.phone ? ` (${user.phone})` : ''}`,
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses.map(course => ({ id: course._id, title: course.title })));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB.' });
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setErrors({ ...errors, image: 'Only PNG and JPEG images are allowed.' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById('image-upload').value = '';
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    if (!type) newErrors.type = 'Type is required';
    if (!audienceType) newErrors.audienceType = 'Audience type is required';
    if (!channel) newErrors.channel = 'Notification channel is required';
    if (audienceType !== 'all' && !audienceValue) newErrors.audienceValue = 'Audience selection is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    if (image) formData.append('image', image);
    formData.append('type', type);
    formData.append('audienceType', audienceType);
    formData.append('recipient', audienceValue);
    formData.append('channel', channel);
    if (channel === 'in-app' && scheduleEnabled && scheduledAt) {
      formData.append('scheduledAt', scheduledAt.toISOString());
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notification`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      addNotification(response.data.notification);
      toast.success(response.data.message);
      setTitle('');
      setMessage('');
      setImage(null);
      setImagePreview(null);
      setAudienceType('all');
      setAudienceValue('all');
      setType('announcement');
      setChannel('in-app');
      setScheduleEnabled(false);
      setScheduledAt(new Date());
      setSearchTerm('');
      setSelectedStudent(null);
      setErrors({});
      document.getElementById('image-upload').value = '';
    } catch (error) {
      console.error('Error creating notification:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || 'Failed to create notification';
      toast.error(errorMessage);
    }
  };

  const filteredStudents = students.filter(student =>
    student.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Create New Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Title</label>
              <div className="relative">
                <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter announcement title"
                  aria-label="Announcement title"
                />
              </div>
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Type</label>
              <div className="relative">
                <MegaphoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-label="Announcement type"
                >
                  <option value="">Select Type</option>
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Message</h3>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Announcement Message</label>
            <div className="relative">
              <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter announcement message"
                aria-label="Announcement message"
              />
            </div>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
        </div>

        {/* Image Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Image (Optional)</h3>
          <div className="relative p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-all duration-200 bg-white">
            <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <input
              id="image-upload"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload announcement image"
            />
            <p className="text-sm text-gray-500 text-center">Drag & drop or click to upload (PNG/JPEG, max 5MB)</p>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-32 mx-auto object-contain border border-gray-200 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out shadow-sm"
                  aria-label="Remove image"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Audience Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Audience Type</label>
              <div className="relative">
                <UsersIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={audienceType}
                  onChange={(e) => {
                    setAudienceType(e.target.value);
                    setAudienceValue(
                      e.target.value === 'all' ? 'all' :
                      e.target.value === 'course' && courses.length > 0 ? courses[0].id :
                      e.target.value === 'student' && students.length > 0 ? students[0].id : ''
                    );
                    setSearchTerm('');
                    setSelectedStudent(null);
                  }}
                  className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                    errors.audienceType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  aria-label="Audience type"
                >
                  <option value="all">All Students</option>
                  <option value="course">By Course</option>
                  <option value="student">Specific Student</option>
                </select>
              </div>
              {errors.audienceType && <p className="text-red-500 text-sm mt-1">{errors.audienceType}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Audience</label>
              {audienceType === 'student' ? (
                <div className="relative">
                  <div className="relative">
                    <UsersIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 border-gray-300 focus:ring-blue-500"
                      placeholder="Search student..."
                      aria-label="Search student"
                    />
                  </div>
                  {searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => {
                              setAudienceValue(student.id);
                              setSelectedStudent(student);
                              setSearchTerm('');
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm transition-all duration-200"
                          >
                            {student.display}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600 text-sm">No students found</div>
                      )}
                    </div>
                  )}
                  {selectedStudent && (
                    <p className="text-blue-600 text-sm mt-1 truncate">Selected: {selectedStudent.display}</p>
                  )}
                  {errors.audienceValue && !selectedStudent && (
                    <p className="text-red-500 text-sm mt-1">{errors.audienceValue}</p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <UsersIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={audienceValue}
                    onChange={(e) => setAudienceValue(e.target.value)}
                    className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                      errors.audienceValue ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    aria-label="Audience selection"
                    disabled={audienceType === 'all'}
                  >
                    {audienceType === 'course' ? (
                      <>
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                      </>
                    ) : (
                      <option value="all">All Students</option>
                    )}
                  </select>
                  {errors.audienceValue && audienceType !== 'student' && (
                    <p className="text-red-500 text-sm mt-1">{errors.audienceValue}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Channel Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Channel</h3>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Channel</label>
            <div className="relative">
              <MegaphoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={channel}
                onChange={(e) => {
                  setChannel(e.target.value);
                  if (e.target.value === 'email') {
                    setScheduleEnabled(false);
                    setScheduledAt(new Date());
                  }
                }}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.channel ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                aria-label="Notification channel"
              >
                <option value="in-app">In-App Notification</option>
                <option value="email">Email</option>
              </select>
            </div>
            {errors.channel && <p className="text-red-500 text-sm mt-1">{errors.channel}</p>}
          </div>
        </div>

        {/* Schedule Section */}
        {channel === 'in-app' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
            <div className="flex items-center space-x-4 mb-4">
              <label className="block text-gray-600 font-medium">Schedule Announcement</label>
              <input
                type="checkbox"
                checked={scheduleEnabled}
                onChange={(e) => setScheduleEnabled(e.target.checked)}
                className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Toggle schedule"
              />
            </div>
            {scheduleEnabled && (
              <div className="relative">
                <label className="block text-gray-600 font-medium mb-1">Schedule Date & Time</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <DatePicker
                    selected={scheduledAt}
                    onChange={setScheduledAt}
                    showTimeSelect
                    dateFormat="Pp"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800"
                    aria-label="Schedule send date and time"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`px-6 py-3 rounded-md shadow-sm font-semibold transition-all duration-200 ease-in-out ${
              Object.keys(errors).length > 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
            aria-label="Create announcement"
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;