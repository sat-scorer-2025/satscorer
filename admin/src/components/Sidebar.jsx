import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sidebarItems = [
    { name: 'Dashboard', path: '/', icon: assets.dashboard_icon },
    { name: 'Course Management', path: '/courses', icon: assets.course_management_icon },
    { name: 'Test Management', path: '/tests', icon: assets.test_management_icon },
    { name: 'Student Management', path: '/students', icon: assets.student_management_icon },
    { name: 'Sales and Payments', path: '/sales', icon: assets.sales_and_payments_icon },
    { name: 'Update Content', path: '/content', icon: assets.content_upload_icon },
    { name: 'Live Class', path: '/live', icon: assets.live_class_icon },
    { name: 'Free Test Access', path: '/free-tests', icon: assets.test_management_icon },
    { name: 'Announcements', path: '/announcements', icon: assets.announcements_icon },
    { name: 'Support and Feedback', path: '/support', icon: assets.support_and_feedback_icon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md w-64 fixed top-20 h-[calc(100vh-80px)] z-40 shadow-md flex flex-col justify-between border-r border-gray-200">
      <div className="flex flex-col p-6 space-y-2">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-1 py-5 w-[210px] text-md font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 shadow-sm border-l-4 border-blue-500'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <img src={item.icon} alt={`${item.name} icon`} className="w-6 h-6 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at the bottom */}
      <div className="px-4 py-6 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-300"
        >
          <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
