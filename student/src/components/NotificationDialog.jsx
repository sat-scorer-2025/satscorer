import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const NotificationDialog = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useContext(AuthContext);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
  }, [notifications]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (notificationId) => {
    setProcessingIds((prev) => new Set([...prev, notificationId]));
    console.log('Mark as read clicked for notification:', notificationId);
    const result = await markNotificationAsRead(String(notificationId));
    console.log('Mark as read result:', result);
    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  return (
    <div
      className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 max-h-[400px] overflow-y-auto"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
          <svg
            fill="none"
            viewBox="0 0 209.77 178.49"
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-32 mb-4"
          >
            <ellipse cx="60.388" cy="12.406" rx="4.497" ry="4.488" fill="#efe5ff"></ellipse>
            <path
              d="m32.909 108.66c0 1.65-1.34 2.99-2.997 2.99a2.993 2.993 0 0 1-2.997-2.99c0-1.649 1.34-2.99 2.997-2.99a2.994 2.994 0 0 1 2.997 2.99zm168.85-44.459c0 1.253-1.211 2.491-2.997 2.491-1.787 0-2.997-1.238-2.997-2.491s1.21-2.491 2.997-2.491c1.786 0 2.997 1.238 2.997 2.491z"
              stroke="#efe5ff"
              strokeWidth="2"
            ></path>
            <ellipse cx="206.27" cy="149.06" rx="3.497" ry="3.491" fill="#efe5ff"></ellipse>
            <path
              d="m183.19 5.739v-5.038l-5e-3 -0.078a0.704 0.704 0 0 0-0.696-0.623 0.7 0.7 0 0 0-0.695 0.613l-5e-3 0.072-1e-3 5.053h-5.034l-0.078 5e-3a0.705 0.705 0 0 0-0.617 0.61l-5e-3 0.072 4e-3 0.094a0.706 0.706 0 0 0 0.609 0.617l0.072 5e-3h5.049v5.038l4e-3 0.072c0.045 0.365 0.343 0.63 0.697 0.63l0.072-4e-3 0.072-0.013a0.702 0.702 0 0 0 0.557-0.685v-5.038h5.034l0.072-3e-3a0.701 0.701 0 0 0-0.072-1.399zm-141.49 167.29v-3.847l-3e-3 -0.06a0.536 0.536 0 0 0-1.066-7e-3l-4e-3 0.055v3.859h-3.854l-0.06 4e-3a0.54 0.54 0 0 0-0.473 0.465l-3e-3 0.055 3e-3 0.072a0.539 0.539 0 0 0 0.466 0.471l0.055 4e-3h3.866v3.848l3e-3 0.055a0.539 0.539 0 0 0 0.534 0.481l0.055-3e-3 0.055-0.01a0.536 0.536 0 0 0 0.426-0.523v-3.848l3.855 1e-3 0.055-3e-3a0.54 0.54 0 0 0 0.481-0.533 0.536 0.536 0 0 0-0.536-0.536zm-35.814-136.1v-4.145l-4e-3 -0.064a0.578 0.578 0 0 0-1.148-8e-3l-3e-3 0.06v4.156h-4.152l-0.065 4e-3a0.581 0.581 0 0 0-0.509 0.5l-4e-3 0.06 4e-3 0.077a0.581 0.581 0 0 0 0.501 0.508l0.06 4e-3h4.164v4.144l3e-3 0.06a0.58 0.58 0 0 0 0.574 0.517l0.06-3e-3 0.059-0.01c0.27-0.06 0.46-0.292 0.46-0.564v-4.144h4.15l0.06-3e-3a0.58 0.58 0 0 0 0.518-0.573 0.577 0.577 0 0 0-0.578-0.577h-4.15z"
              fill="#efe5ff"
            ></path>
            <g transform="translate(-.238 -.291)" filter="url(#f)">
              <path
                d="m117 142.5c0 3.59-18.132 6.5-40.5 6.5-22.367 0-40.5-2.91-40.5-6.5s18.133-6.5 40.5-6.5c22.368 0 40.5 2.91 40.5 6.5z"
                fill="#c4c1fe"
                fillOpacity=".7"
              ></path>
            </g>
            <path
              d="m98.26 41.23a5.085 5.085 0 0 1-6.737-2.519l-1.28-2.806a5.0859 5.0859 0 1 1 9.256-4.218l1.28 2.806a5.084 5.084 0 0 1-2.519 6.737z"
              fill="#7c6aea"
            ></path>
            <path
              d="m91.266 121.06s-8.49-41.782-9.528-46.662c-8.308-39.036 28.599-54.822 52.402-23.877 3.018 3.927 28.96 37.81 28.96 37.81z"
              fill="#cec6ff"
            ></path>
            <path
              d="m87.577 135.16s-1.403-11.558 0.469-13.727c15.109-17.524 55.108-35.286 77.444-35.286 2.86 0 10.664 8.653 10.664 8.653z"
              fill="#7c6aea"
            ></path>
            <path
              d="m86.553 147.39s-4.01-10.373-1.847-12.675c17.47-18.601 68.38-41.332 92.998-42.37 3.151-0.133 8.353 9.711 8.353 9.711z"
              fill="#cec6ff"
            ></path>
            <path
              d="m131.2 113.53c27.478-12.516 52.031-17.658 54.847-11.474 2.815 6.184-17.174 21.338-44.652 33.86-27.478 12.516-52.031 17.658-54.846 11.474-2.811-6.184 17.179-21.343 44.651-33.86z"
              fill="#a192ff"
            ></path>
            <mask id="e" x="88" y="102" width="99" height="51" maskUnits="userSpaceOnUse">
              <path
                d="m132.63 117.53c26.978-12.604 51.015-18.654 53.911-12.721 2.895 5.932-16.624 20.954-43.603 33.563-26.978 12.604-51.191 18.021-54.087 12.088-2.89-5.932 16.806-20.326 43.779-32.93z"
                fill="#a192ff"
              ></path>
            </mask>
            <g transform="translate(-.238 -.291)" mask="url(#e)">
              <path
                d="m132.97 132.43c7.619 0 13.795-6.176 13.795-13.795 0-7.618-6.176-13.794-13.795-13.794-7.618 0-13.794 6.176-13.794 13.794 0 7.619 6.176 13.795 13.794 13.795z"
                fill="#cec6ff"
              ></path>
            </g>
            <path
              d="m97.455 83.891h-57.954a3.74 3.74 0 0 1-3.739-3.739v-16.132a3.74 3.74 0 0 1 3.74-3.739h57.953a3.74 3.74 0 0 1 3.739 3.74v16.131a3.743 3.743 0 0 1-3.74 3.74z"
              fill="url(#d)"
            ></path>
            <path
              d="m59.352 69.641h35.835m-35.835 6.368h16.898"
              stroke="#fff"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="1.349"
            ></path>
            <path
              d="m47.265 77.293a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"
              fill="#fff"
            ></path>
            <defs>
              <linearGradient id="d" x1="33.61" x2="46.273" y1="75.312" y2="40.246" gradientTransform="translate(-.238 -.291)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#53E5D6" offset="0"></stop>
                <stop stopColor="#40BAD6" offset=".87"></stop>
              </linearGradient>
              <filter id="f" x="21.844" y="121.84" width="109.31" height="41.313" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur result="effect1_foregroundBlur_1_39" stdDeviation="7.078"></feGaussianBlur>
              </filter>
            </defs>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Notifications Yet</h2>
          <p className="text-sm text-gray-600 text-center">You have no notifications right now. Come back later</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div key={String(notification._id)} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkAsRead(String(notification._id))}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  disabled={processingIds.has(String(notification._id))}
                >
                  {processingIds.has(String(notification._id)) ? 'Processing...' : 'Mark as Read'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDialog;