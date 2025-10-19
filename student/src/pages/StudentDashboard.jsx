import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/StudentDashboard/Sidebar";

const StudentDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isViewCourse = location.pathname.startsWith(
    "/studentdashboard/mycourses/viewcourse"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 md:ml-64 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto transition-all duration-300">
          {!isViewCourse && (
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Student Dashboard
              </h1>
              <hr className="border-b-2 mt-4 border-gray-300" />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
