import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { MagnifyingGlassIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const ManageFreePaidTests = () => {
  const { tests, setTests, courses, loading, error } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async (testId, currentIsFree) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/test/${testId}`,
        { isFree: !currentIsFree },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTests(tests.map((t) => (t._id === testId ? response.data.test : t)));
      toast.success(`Test marked as ${currentIsFree ? 'paid' : 'free'} successfully.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to update test status', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.status === 'published' &&
      (selectedCourse === '' || (test.courseId && courses.find((course) => course._id === test.courseId)?.title === selectedCourse)) &&
      (searchQuery === '' ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.courseId && courses.find((course) => course._id === test.courseId)?.title.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.title : 'Unassigned';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return `${duration} min`;
  };

  const formatAttempts = (attempts) => {
    if (attempts === null || attempts === undefined) return 'Unlimited';
    return attempts.toString();
  };

  const formatIsFree = (isFree) => {
    return isFree ? 'Yes' : 'No';
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Manage Free/Paid Tests</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm mb-6">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests by title or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            disabled={isLoading || loading}
          />
        </div>
        <div className="relative">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full sm:w-48 p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8"
            disabled={isLoading || loading}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course.title}>
                {course.title}
              </option>
            ))}
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
        {isLoading || loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No tests match the search or selected course.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Test Title</th>
                <th className="p-4 border border-gray-200 text-center">Course</th>
                <th className="p-4 border border-gray-200 text-center">Test Type</th>
                <th className="p-4 border border-gray-200 text-center">Duration (min)</th>
                <th className="p-4 border border-gray-200 text-center">Exam Type</th>
                <th className="p-4 border border-gray-200 text-center">No. of Attempts</th>
                <th className="p-4 border border-gray-200 text-center">Is Free</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test, index) => (
                <tr
                  key={test._id}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{index + 1}.</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{test.title}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{getCourseTitle(test.courseId)}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{test.testType.replace('-', ' ').toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{formatDuration(test.duration)}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{test.examType.toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{formatAttempts(test.noOfAttempts)}</td>
                  <td className="px-4 py-3 text-center border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.isFree ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {formatIsFree(test.isFree)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.status === 'published' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleToggleStatus(test._id, test.isFree)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-200 ${
                        test.isFree
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      disabled={isLoading}
                    >
                      <CurrencyRupeeIcon className="w-4 h-4" />
                      <span>{test.isFree ? 'Mark Paid' : 'Mark Free'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageFreePaidTests;