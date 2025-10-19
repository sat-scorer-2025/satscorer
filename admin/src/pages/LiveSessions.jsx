import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const LiveSessions = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses || []);
      } catch (error) {
        toast.error('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/livesession`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data.sessions || []);
      } catch (error) {
        toast.error('Failed to fetch sessions: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchSessions();
  }, [token]);

  const handleTabChange = (tab) => {
    navigate(`/live/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Live Sessions Dashboard</h1>
        <div className="flex border-b border-gray-200 px-6">
          {['create', 'manage'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 font-semibold text-md transition-all duration-200 ${
                location.pathname === `/live/${tab}` || (tab === 'manage' && location.pathname.startsWith('/live/manage'))
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab === 'create' ? 'Create Session' : 'Join Sessions'}
            </button>
          ))}
        </div>
      </div>
      </div>
      <div className="p-4 relative">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <Outlet context={{ courses, sessions, setSessions }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSessions;