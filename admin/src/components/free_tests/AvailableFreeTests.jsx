import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const AvailableFreeTests = () => {
  const { tests, setTests, courses, loading, error } = useOutletContext();

  const handleMarkPaid = async (test) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/test/${test._id}`,
        { isFree: false },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTests(tests.map((t) => (t._id === test._id ? response.data.test : t)));
      toast.success(`Test "${test.title}" marked as paid.`, {
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
    }
  };

  const freeTests = tests.filter((test) => test.isFree && test.status === 'published');

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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Available Free Tests</h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">{error}</div>
      ) : freeTests.length === 0 ? (
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
          <p className="mt-2 text-gray-600 text-lg">No free tests available at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {freeTests.map((test, index) => (
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
                  <td className="px-4 py-3 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleMarkPaid(test)}
                      className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                    >
                      <CurrencyRupeeIcon className="w-4 h-4" />
                      <span>Mark Paid</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailableFreeTests;