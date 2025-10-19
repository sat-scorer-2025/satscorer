import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const CourseCard = ({ course }) => {
  const isExpired =
    course.enrollmentStatus === "expired" ||
    (course.endDate && new Date(course.endDate) < new Date());

  // Format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto h-[400px]">
      {/* Status Badge */}
      <div
        className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${
          isExpired ? "bg-yellow-500" : "bg-green-600"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isExpired ? "bg-yellow-200" : "bg-green-300"
          }`}
        ></div>
        {isExpired ? "Expired" : "Active"}
      </div>

      {/* Thumbnail */}
      <div className="w-full h-40 sm:h-44 overflow-hidden">
        <img
          src={
            course.thumbnail ||
            "https://via.placeholder.com/400x200?text=Course+Thumbnail"
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 min-h-[54px]">
            {course.description || "No description available."}
          </p>

          <div className="mt-3 space-y-1 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>Start: {formatDate(course.startDate)}</span>
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span>End: {formatDate(course.endDate)}</span>
            </p>
          </div>
        </div>

        {/* Button */}
        {isExpired ? (
          <button
            className="mt-5 w-full bg-yellow-100 text-yellow-700 text-sm sm:text-base py-2 rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
            disabled
          >
            <AcademicCapIcon className="w-5 h-5" />
            Course Expired
          </button>
        ) : (
          <Link
            to={`/studentdashboard/mycourses/viewcourse/${course._id}`}
            className="mt-5 w-full bg-green-600 text-white text-sm sm:text-base py-2 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <AcademicCapIcon className="w-5 h-5" />
            View Course
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
