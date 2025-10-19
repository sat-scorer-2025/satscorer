import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Announcements = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
        setFilteredNotifications(response.data.notifications || []);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch notifications');
        setLoading(false);
        toast.error('Failed to fetch notifications', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header and Tabs */}
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Announcement Management Dashboard</h1>
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {['creates', 'manage'].map((tab) => (
            <NavLink
              key={tab}
              to={`/announcements/${tab}`}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              {tab === 'creates' ? 'Create Announcement' : 'View Announcements'}
            </NavLink>
          ))}
        </div>
      </div>
      </div>
      {/* Tab Content */}
      <div className="p-4 relative">
        <Outlet context={{ notifications, setNotifications, filteredNotifications, setFilteredNotifications, loading, error }} />
      </div>
    </div>
  );
};

export default Announcements;