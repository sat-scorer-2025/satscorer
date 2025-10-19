import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import NotificationModal from './NotificationModal';
import { useAuth } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useOutletContext } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import { MagnifyingGlassIcon, EyeIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageAnnouncement = () => {
  const { notifications, setNotifications, filteredNotifications, setFilteredNotifications, loading, error } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const { token } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    const filtered = notifications.filter((notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotifications(filtered);
  }, [searchTerm, notifications, setFilteredNotifications]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));

    setFilteredNotifications((prev) =>
      [...prev].sort((a, b) => {
        if (key === 'title') {
          return sortConfig.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (key === 'createdAt') {
          return sortConfig.direction === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (key === 'status') {
          return sortConfig.direction === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      })
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l5-5 5 5M7 17l5 5 5-5" />
      </svg>
    );
  };

  const handleResend = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notification/resend/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? response.data.notification : n));
      setFilteredNotifications(filteredNotifications.map(n => n._id === id ? response.data.notification : n));
      addNotification(response.data.notification);
      toast.success('Notification resent successfully');
    } catch (error) {
      console.error('Error resending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to resend notification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter(n => n._id !== id));
      setFilteredNotifications(filteredNotifications.filter(n => n._id !== id));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    } finally {
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Manage Notifications</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm mb-6">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications by title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            aria-label="Search notifications"
            disabled={loading}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No notifications found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th
                  className="p-4 border border-gray-200 text-center cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title {getSortIcon('title')}
                </th>
                <th className="p-4 border border-gray-200 text-center">Audience</th>
                <th
                  className="p-4 border border-gray-200 text-center cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Creation Date {getSortIcon('createdAt')}
                </th>
                <th className="p-4 border border-gray-200 text-center">Creation Time</th>
                <th className="p-4 border border-gray-200 text-center">Scheduled At</th>
                <th className="p-4 border border-gray-200 text-center">Channel</th>
                <th
                  className="p-4 border border-gray-200 text-center cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification, index) => (
                <tr
                  key={notification._id}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{notification.title}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{notification.recipientDetails?.value || notification.recipient}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {notification.createdAt ? format(new Date(notification.createdAt), 'dd-MM-yyyy') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {notification.createdAt ? format(new Date(notification.createdAt), 'hh:mm a') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {notification.scheduledAt ? format(new Date(notification.scheduledAt), 'dd-MM-yyyy hh:mm a') : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}</td>
                  <td className="px-4 py-3 text-center border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        notification.status === 'sent'
                          ? 'bg-blue-100 text-blue-600'
                          : notification.status === 'pending'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex space-x-2 justify-center">
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                      aria-label={`View ${notification.title}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleResend(notification._id)}
                      className="flex items-center space-x-1 bg-green-100 text-green-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-green-200 hover:scale-105 transition-all duration-200"
                      aria-label={`Resend ${notification.title}`}
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                      <span>Resend</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(notification._id, notification.title)}
                      className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                      aria-label={`Delete ${notification.title}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <NotificationModal
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => handleDelete(deleteModal.id)}
        message={`Are you sure you want to delete the notification "${deleteModal.title}"?`}
      />
    </div>
  );
};

export default ManageAnnouncement;