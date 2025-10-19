import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const TestManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header and Tabs */}
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Test Management Dashboard</h1>
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {['create', 'manage', 'analytics'].map((tab) => (
            <NavLink
              key={tab}
              to={`/tests/${tab}`}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              {tab === 'create' ? 'Create Test' : tab === 'manage' ? 'Manage Tests' : 'Test Analysis'}
            </NavLink>
          ))}
        </div>
      </div>
      </div>
      {/* Tab Content */}
      <div className="p-4 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default TestManagement;