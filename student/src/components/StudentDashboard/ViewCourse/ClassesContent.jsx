import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentContext } from '../../../context/StudentContext';
import { VideoCameraIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const ClassesContent = () => {
  const { enrolledcourseId } = useParams();
  const { fetchLiveSessionsForCourse, error } = useStudentContext();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Track expanded state per session

  useEffect(() => {
    const loadSessions = async () => {
      if (hasFetched) return; // Prevent multiple fetches
      setLoading(true);
      const sessionData = await fetchLiveSessionsForCourse(enrolledcourseId);
      // Filter out past sessions (earlier than today)
      const upcomingSessions = (sessionData || []).filter(session => {
        const sessionDate = new Date(session.scheduledAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        return sessionDate >= today;
      });
      setSessions(upcomingSessions);
      setFilteredSessions(upcomingSessions);
      setLoading(false);
      setHasFetched(true);
    };

    if (enrolledcourseId) {
      loadSessions();
    }
  }, [enrolledcourseId, fetchLiveSessionsForCourse, hasFetched]);

  useEffect(() => {
    const filtered = sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSessions(filtered);
  }, [searchTerm, sessions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    setHasFetched(false); // Reset to allow re-fetch
  };

  const toggleDescription = (sessionId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Format date to dd/mm/yyyy HH:MM
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  // Determine if session is live (within ±15 minutes of scheduledAt)
  const isSessionLive = (scheduledAt) => {
    if (!scheduledAt) return false;
    const now = new Date();
    const sessionTime = new Date(scheduledAt);
    const timeDiff = Math.abs(now - sessionTime) / (1000 * 60); // Difference in minutes
    return timeDiff <= 15; // Consider live if within 15 minutes
  };

  // Determine if description is long enough to need "More..." button
  const isDescriptionLong = (description) => {
    return (description || '').length > 100; // Arbitrary threshold; adjust if needed
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <ArrowPathIcon className="w-10 h-10 text-green-500 animate-spin" />
        <span className="ml-3 text-lg font-['Inter',sans-serif] text-gray-800">Loading live sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white text-red-400">
        <ExclamationTriangleIcon className="w-10 h-10 mr-3" />
        <div className="text-center">
          <span className="text-lg font-['Inter',sans-serif]">{error}</span>
          <button
            onClick={handleRetry}
            className="ml-2 text-blue-500 hover:underline text-sm font-['Inter',sans-serif]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-white min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-['Inter',sans-serif] font-bold text-gray-800 flex items-center">
            <VideoCameraIcon className="w-10 h-10 mr-3 text-green-500" />
            Live Sessions
          </h2>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search live sessions by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-['Inter',sans-serif] text-gray-800 placeholder-gray-400"
            />
            <svg
              className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
        {filteredSessions.length === 0 ? (
          <div className="text-center text-gray-600 py-16 bg-yellow-50 rounded-lg shadow-md">
            <VideoCameraIcon className="w-16 h-16 mx-auto text-yellow-400/70 mb-3" />
            <p className="text-lg font-['Inter',sans-serif]">No live sessions available for this course.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSessions.map((session, index) => (
              <div
                key={session._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm mx-auto h-64"
              >
                <div className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      {index + 1}. {session.title}
                    </h3>
                    <VideoCameraIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="mt-2 flex-1 relative">
                    {expandedDescriptions[session._id] ? (
                      <div className="h-full overflow-auto text-xs sm:text-sm text-gray-600 pr-2">
                        {session.description || 'No description available'}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-600 h-12 overflow-hidden">
                        {session.description || 'No description available'}
                      </p>
                    )}
                    {isDescriptionLong(session.description) && (
                      <button
                        onClick={() => toggleDescription(session._id)}
                        className="absolute bottom-0 right-0 text-blue-500 hover:underline text-xs font-['Inter',sans-serif]"
                      >
                        {expandedDescriptions[session._id] ? 'Less...' : 'More...'}
                      </button>
                    )}
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-gray-500 space-y-1">
                    <p>Scheduled: {formatDateTime(session.scheduledAt)}</p>
                    <p>Platform: {session.platform}</p>
                  </div>
                  <a
                    href={isSessionLive(session.scheduledAt) ? session.link : '#'}
                    target='_self'
                    rel={isSessionLive(session.scheduledAt) ? 'noopener noreferrer' : undefined}
                    className={`mt-4 block w-full text-center text-sm sm:text-base py-2 rounded transition duration-200 ${
                      isSessionLive(session.scheduledAt)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-yellow-200 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => !isSessionLive(session.scheduledAt) && e.preventDefault()}
                  >
                    {isSessionLive(session.scheduledAt) ? 'Join Now' : 'Upcoming Class'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesContent;