import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import UpdateCourseContentForm from '../components/content/UpdateCourseContentForm';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const UpdateContent = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (examFilter ? course.examType === examFilter : true)
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    navigate(`/content/${course._id}/updatecontent`);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Update Course Content</h1>
      </div>
      </div>
      {selectedCourse ? (
        <div className="p-4 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Updating Content for: {selectedCourse.title}
              </h2>
              <button
                onClick={handleBackToCourses}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out"
              >
                &lt; Back to Courses
              </button>
            </div>
            <UpdateCourseContentForm course={selectedCourse} />
          </div>
        </div>
      ) : (
        <div className="p-4 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Select a Course</h2>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
              <div className="relative flex-grow mb-4 sm:mb-0">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="w-full sm:w-48 p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8"
                  disabled={isLoading}
                >
                  <option value="">All Exams</option>
                  <option value="SAT">SAT</option>
                  <option value="ACT">ACT</option>
                  <option value="GRE">GRE</option>
                  <option value="IELTS">IELTS</option>
                  <option value="GMAT">GMAT</option>
                  <option value="AP">AP</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-4">
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-600 text-lg">No courses available. Please create a course first.</p>
                </div>
              ) : (
                <table className="w-full border border-gray-100 rounded-lg">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                      <th className="p-4 border border-gray-200 text-center">S.No.</th>
                      <th className="p-4 border border-gray-200 text-center">Course</th>
                      <th className="p-4 border border-gray-200 text-center">Exam</th>
                      <th className="p-4 border border-gray-200 text-center">Price</th>
                      <th className="p-4 border border-gray-200 text-center">Start Date</th>
                      <th className="p-4 border border-gray-200 text-center">End Date</th>
                      <th className="p-4 border border-gray-200 text-center">Enrollments</th>
                      <th className="p-4 border border-gray-200 text-center">Status</th>
                      <th className="p-4 border border-gray-200 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course, index) => (
                      <tr
                        key={course._id}
                        className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                      >
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{course.title}</td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{course.examType}</td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">₹{course.price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                          {course.startDate ? format(new Date(course.startDate), 'dd-MM-yyyy') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                          {course.endDate ? format(new Date(course.endDate), 'dd-MM-yyyy') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{course.enrollments?.length || 0}</td>
                        <td className="px-4 py-3 text-center border border-gray-200">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              course.status === 'published'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center border border-gray-200">
                          <button
                            className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200 mx-auto"
                            onClick={() => handleSelectCourse(course)}
                            disabled={isLoading}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span>Update Content</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateContent;