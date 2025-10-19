import React from 'react';
import { Link } from 'react-router-dom';
import { useStudentContext } from '../../context/StudentContext';
import CourseCard from '../../components/StudentDashboard/CourseCard';

const MyCourses = () => {
  const { courses, isLoading, error, fetchCourses } = useStudentContext();

  return (
    <div className="py-6">
      {error && (
        <div className="text-center text-red-500 text-sm sm:text-base mb-6">
          {error}
          <button
            onClick={fetchCourses}
            className="ml-2 text-blue-500 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-600 text-sm sm:text-base">
          Loading your courses...
        </div>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center text-gray-600 text-base sm:text-lg py-12">
          You are not enrolled in any courses.{' '}
          <Link to="/courses" className="text-blue-500 hover:underline">
            Explore Courses
          </Link>
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
