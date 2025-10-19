import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationModal = ({ open, onClose, notification }) => {
  if (!open || !notification) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{notification.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out"
            aria-label="Close notification modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 text-gray-600 text-sm">
          <div className="flex items-center">
            <span className="font-medium w-28">Audience:</span>
            <span>{notification.recipientDetails?.value || notification.recipient}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium w-28">Type:</span>
            <span>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium w-28">Channel:</span>
            <span>{notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium w-28">Created At:</span>
            <span>{formatDate(notification.createdAt)}</span>
          </div>
          {notification.scheduledAt && (
            <div className="flex items-center">
              <span className="font-medium w-28">Scheduled At:</span>
              <span>{formatDate(notification.scheduledAt)}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium w-28">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              notification.status === 'sent'
                ? 'bg-blue-100 text-blue-600'
                : notification.status === 'pending'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
            </span>
          </div>
          <div>
            <span className="font-medium block mb-1">Message:</span>
            <pre className="p-3 bg-gray-100 rounded-md border border-gray-200 text-gray-800 whitespace-pre-wrap">
              {notification.message}
            </pre>
          </div>
          {notification.image && (
            <div>
              <span className="font-medium block mb-1">Image:</span>
              <img src={notification.image} alt="Notification" className="mt-2 max-w-full rounded-md border border-gray-200 object-contain max-h-48" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;