import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import NotificationDialog from './NotificationDialog';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { logout, notifications } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProfileOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsProfileOpen(false), 500);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationClose = () => {
    timeoutRef.current = setTimeout(() => setIsNotificationOpen(false), 500);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white fixed w-full top-0 z-50 border-b border-gray-300 h-20">
      <div className="mx-auto px-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left side: Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">SATscorer</span>
              <span className="text-sm font-medium text-gray-600">Admin Panel</span>
            </div>
          </Link>

          {/* Right side: Notification Bell and Profile */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={handleNotificationClick}
              >
                <img src={assets.notification_bell} alt="Notifications" className="w-7 h-7 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                )}
              </button>
              <NotificationDialog 
                isOpen={isNotificationOpen} 
                onClose={handleNotificationClose} 
              />
            </div>
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                <img src={assets.profile} alt="Profile" className="w-8 h-8 rounded-full border border-gray-300" />
                <span className="text-sm font-medium text-gray-700 hidden md:block">Admin</span>
              </div>
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-3 border border-gray-100 z-30"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;