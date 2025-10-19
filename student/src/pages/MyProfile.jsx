import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useStudentContext } from '../context/StudentContext';

const MyProfile = () => {
  const { fetchProtected, authLoading, authError } = useContext(AuthContext);
  const { courses, fetchCourses, isLoading: coursesLoading, error: coursesError } = useStudentContext();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    exam: '',
    university: '',
    password: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  // Base API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProfileData = async () => {
    if (hasFetchedProfile) return;
    setHasFetchedProfile(true);
    setFormError('');

    try {
      // Fetch user profile
      const userResponse = await fetchProtected(`${API_URL}/api/user/profile`);
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.message || 'Failed to fetch profile');
      }
      setUser(userData.user);
      setFormData({
        name: userData.user.name || '',
        email: userData.user.email || '',
        phone: userData.user.phone || '',
        address: userData.user.address || '',
        dateOfBirth: userData.user.dateOfBirth ? new Date(userData.user.dateOfBirth).toISOString().split('T')[0] : '',
        exam: userData.user.exam || '',
        university: userData.user.university || '',
        password: '',
      });

      // Fetch enrolled courses
      await fetchCourses();
    } catch (err) {
      setFormError(err.message || 'Failed to load profile data');
      setUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        exam: '',
        university: '',
        password: '',
      });
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProtected, fetchCourses, hasFetchedProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setFormError('Please upload a JPEG or PNG image.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Image size must be less than 2MB.');
        return;
      }
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
      setFormError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setFormError('Please enter a valid 10-digit phone number.');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setFormError('');
      setSuccessMessage('');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('exam', formData.exam);
      formDataToSend.append('university', formData.university);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      if (profilePicFile) {
        formDataToSend.append('profilePhoto', profilePicFile);
      }

      const response = await fetchProtected(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Update profile error:', data);
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      setFormData((prev) => ({
        ...prev,
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : '',
        exam: data.user.exam || '',
        university: data.user.university || '',
        password: '',
      }));
      setIsEditing(false);
      setProfilePic(null);
      setProfilePicFile(null);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    }
  };

  const handleRetry = () => {
    setHasFetchedProfile(false);
    setFormError('');
  };

  if (authLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (formError || authError || coursesError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-xl font-semibold">
          {formError || authError || coursesError}
          <button
            onClick={handleRetry}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg text-center text-sm font-medium border border-green-200 transition-all duration-300">
            {successMessage}
          </div>
        )}
        {(formError || authError) && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg text-center text-sm font-medium border border-red-200 transition-all duration-300">
            {formError || authError}
          </div>
        )}

        <div className="space-y-10">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={profilePic || user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=ffffff`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-all duration-300 shadow-sm">
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFileChange} />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              )}
            </div>
            {formError && <p className="mt-3 text-sm text-red-600 font-medium text-center">{formError}</p>}
          </div>

          {/* Profile Details Section */}
          <div className="space-y-8">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                  <select
                    name="exam"
                    value={formData.exam}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                  >
                    <option value="">Select Exam</option>
                    {['GRE', 'SAT', 'GMAT', 'IELTS', 'ACT', 'AP'].map((exam) => (
                      <option key={exam} value={exam}>
                        {exam}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="University"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.address || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Exam</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.exam || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">University</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.university || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.status || 'Not set'}</p>
                  </div>
                </div>
                {/* Enrolled Courses Section */}
                <div className="mt-8">
                  <p className="text-sm font-medium text-gray-500 mb-3">Enrolled Courses</p>
                  {courses.length > 0 ? (
                    <ul className="space-y-3">
                      {courses.map((course) => (
                        <li key={course._id} className="text-base font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                          {course.title} - <span className="text-indigo-600">Status: {course.enrollmentStatus}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base font-medium text-gray-600">No courses enrolled</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        address: user?.address || '',
                        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                        exam: user?.exam || '',
                        university: user?.university || '',
                        password: '',
                      });
                      setProfilePic(null);
                      setProfilePicFile(null);
                      setFormError('');
                    }}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;