import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const CourseManagement = () => {
  return (
    <div className=" min-h-screen bg-gray-100">
      {/* Fixed Header and Tabs */}
      <div className="sticky top-16 z-30 bg-white shadow-md">
      <div className="sticky top-16 z-30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Course Management Dashboard</h1>
        <div className="flex border-b border-gray-200 px-6">
          <NavLink
            to="create"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Create Course
          </NavLink>
          <NavLink
            to="content"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Upload Content
          </NavLink>
          <NavLink
            to="manage"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Manage Courses
          </NavLink>
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

export default CourseManagement;