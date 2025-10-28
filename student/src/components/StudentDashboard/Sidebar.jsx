import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  AcademicCapIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  BookOpenIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChatBubbleBottomCenterTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { enrolledcourseId } = useParams();
  const isViewCourse = location.pathname.startsWith(
    "/studentdashboard/mycourses/viewcourse"
  );

  const dashboardNavItems = [
    { name: "My Courses", path: "/studentdashboard/mycourses", icon: AcademicCapIcon },
    { name: "Support", path: "/studentdashboard/support", icon: LifebuoyIcon },
    { name: "Settings", path: "/studentdashboard/settings", icon: Cog6ToothIcon },
  ];

  const courseNavItems = [
    {
      name: "Videos/Lectures",
      path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/lectures`,
      icon: VideoCameraIcon,
    },
    {
      name: "Notes",
      path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/notes`,
      icon: DocumentTextIcon,
    },
    {
      name: "Live Sessions/Class",
      path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/classes`,
      icon: BookOpenIcon,
    },
    {
      name: "Tests",
      path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests`,
      icon: ChatBubbleBottomCenterTextIcon,
    },
  ];

  const navItems = isViewCourse ? courseNavItems : dashboardNavItems;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-indigo-950 to-purple-950 text-white p-5 transform transition-transform duration-300 z-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:top-16 md:h-[calc(100vh-64px)]`}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-lg font-semibold">
            {isViewCourse ? "Course Menu" : "Dashboard Menu"}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-300 hover:text-white transition" />
          </button>
        </div>

        {/* Title on desktop */}
        <h2 className="text-lg sm:text-xl font-semibold mb-6 mt-7 hidden md:block">
          {isViewCourse ? "Course Menu" : "Dashboard Menu"}
        </h2>

        <hr className="border-gray-600 mb-4" />

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-4 rounded-md text-sm sm:text-base transition duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
