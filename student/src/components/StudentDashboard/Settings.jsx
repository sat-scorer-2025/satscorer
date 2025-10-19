


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Settings = () => {
  const { fetchProtected, authError, user, refreshUserData } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  // Base API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch user profile on mount, only if not already fetched
  useEffect(() => {
    if (hasFetchedProfile || !user) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setFormError('');
      try {
        const token = localStorage.getItem('token');
        console.log('fetchProfile: Token', token ? token.slice(0, 20) + '...' : 'No token');
        const response = await fetchProtected(`${API_URL}/api/user/profile`);
        const data = await response.json();
        console.log('fetchProfile: Response data', data);
        if (response.ok) {
          setProfile({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          });
          setNotifications({
            email: data.user.notifications?.email ?? true,
            sms: data.user.notifications?.sms ?? false,
          });
          setFormError('');
          setHasFetchedProfile(true);
        } else {
          console.error('fetchProfile: Error', data);
          setFormError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('fetchProfile: Exception', err);
        setFormError(err.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [fetchProtected, user, hasFetchedProfile]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleNotificationToggle = (type) => {
    setNotifications({ ...notifications, [type]: !notifications[type] });
    setFormError('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      console.log('handleProfileUpdate: Token', token ? token.slice(0, 20) + '...' : 'No token');
      const response = await fetchProtected(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          notifications,
        }),
      });
      const data = await response.json();
      console.log('handleProfileUpdate: Response data', data);
      if (response.ok) {
        await refreshUserData();
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('handleProfileUpdate: Error', data);
        setFormError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('handleProfileUpdate: Exception', err);
      setFormError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setFormError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      console.log('handlePasswordUpdate: Token', token ? token.slice(0, 20) + '...' : 'No token');
      const response = await fetchProtected(`${API_URL}/api/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });
      const data = await response.json();
      console.log('handlePasswordUpdate: Response data', data);
      if (response.ok) {
        setPassword({ current: '', new: '', confirm: '' });
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('handlePasswordUpdate: Error', data);
        setFormError(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('handlePasswordUpdate: Exception', err);
      setFormError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (formError || authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-xl font-semibold">
          {formError || authError}
          <button
            onClick={() => {
              setFormError('');
              setHasFetchedProfile(false);
              window.location.reload();
            }}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg text-center text-sm font-medium border border-green-200 transition-all duration-300">
          {successMessage}
        </div>
      )}

      {/* Profile Settings */}
      <div className="mb-8 bg-white shadow p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={profile.phone}
              onChange={handleProfileChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-2 rounded-md text-white font-medium transition-all duration-300 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="mb-8 bg-white shadow p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={password.current}
              onChange={handlePasswordChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="new"
              placeholder="New Password"
              value={password.new}
              onChange={handlePasswordChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              placeholder="Confirm New Password"
              value={password.confirm}
              onChange={handlePasswordChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-2 rounded-md text-white font-medium transition-all duration-300 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white shadow p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationToggle('email')}
              className="w-4 h-4 rounded focus:ring-indigo-500"
            />
            Receive Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleNotificationToggle('sms')}
              className="w-4 h-4 rounded focus:ring-indigo-500"
            />
            Receive SMS Notifications
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;