import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useOutletContext, Outlet } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';

const ManageSessions = () => {
  const { token } = useAuth();
  const { courses, sessions, setSessions } = useOutletContext();
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === '' || session.courseId?._id === filterCourse;
      return matchesSearch && matchesCourse;
    });
    setFilteredSessions(filtered);
  }, [searchTerm, filterCourse, sessions]);

  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown Course';
    const id = typeof courseId === 'object' && courseId?._id ? courseId._id : courseId;
    const course = courses.find((c) => c._id === id);
    return course ? course.title : 'Unknown Course';
  };

  const getSessionStatus = (scheduledAt) => {
    if (!scheduledAt) return 'scheduled';
    const now = new Date();
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour after start

    if (now < start) return 'scheduled';
    if (now >= start && now < end) return 'ongoing';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'ongoing':
        return 'bg-teal-100 text-teal-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDelete = async (sessionId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/livesession/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessions.filter((s) => s._id !== sessionId));
      toast.success('Session deleted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Failed to delete session: ${errorMsg}`);
    } finally {
      setIsLoading(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const handleEdit = (session) => {
    navigate(`/live/manage/${session._id}/edit`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Manage Live Sessions</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions by title or platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full sm:w-48 p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8"
            disabled={isLoading}
          >
            <option value="">All Courses</option>
            {courses && courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-gray-600 text-lg">No sessions found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Session Title</th>
                <th className="p-4 border border-gray-200 text-center">Course</th>
                <th className="p-4 border border-gray-200 text-center">Scheduled Date</th>
                <th className="p-4 border border-gray-200 text-center">Scheduled Time</th>
                <th className="p-4 border border-gray-200 text-center">Platform</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => {
                const status = getSessionStatus(session.scheduledAt);
                return (
                  <tr
                    key={session._id}
                    className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{session.title}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{getCourseName(session.courseId)}</td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {session.scheduledAt ? format(new Date(session.scheduledAt), 'dd-MM-yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                      {session.scheduledAt ? format(new Date(session.scheduledAt), 'hh:mm a') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{session.platform}</td>
                    <td className="px-4 py-3 text-center border border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-2 justify-center">
                      <a
                        href={session.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-teal-100 text-teal-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-teal-200 hover:scale-105 transition-all duration-200"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Join</span>
                      </a>
                      <button
                        onClick={() => handleEdit(session)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(session._id, session.title)}
                        className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => handleDelete(deleteModal.id)}
        message={`Are you sure you want to delete the session "${deleteModal.title}"?`}
      />
      <Outlet context={{ courses, sessions, setSessions }} />
    </div>
  );
};

export default ManageSessions;