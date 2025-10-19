import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PopularCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize for comparison

        const validCourses = response.data.courses.filter(course => {
          if (!course.endDate) return true; // if no endDate, assume active
          const endDate = new Date(course.endDate);
          endDate.setDate(endDate.getDate() + 1); // course valid till endDate inclusive
          return endDate >= today;
        });

        const sortedCourses = validCourses
          .map(course => ({
            id: course._id,
            name: course.title,
            enrollments: course.enrollments?.length || 0,
          }))
          .sort((a, b) => b.enrollments - a.enrollments)
          .slice(0, 5); // top 5 only

        setCourses(sortedCourses);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch popular courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPopularCourses();
    }
  }, [token]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Popular Courses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
              <th className="pb-4">Course Name</th>
              <th className="pb-4 text-center">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <td className="py-3">
                  <Link to={`/courses/manage`} className="text-blue-600 font-medium hover:underline">
                    {course.name}
                  </Link>
                </td>
                <td className="py-3 text-center text-gray-700 font-medium">{course.enrollments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/courses/manage" className="text-blue-600 hover:underline mt-6 block text-sm font-medium">
        View All
      </Link>
    </div>
  );
};

export default PopularCourses;
