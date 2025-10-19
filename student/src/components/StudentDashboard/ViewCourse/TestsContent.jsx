import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../../../context/StudentContext';
import { ArrowPathIcon, ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const TestsContent = () => {
  const { enrolledcourseId } = useParams();
  const navigate = useNavigate();
  const { fetchTestsForCourse, fetchResult } = useStudentContext();
  const [tests, setTests] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasFetchedTests, setHasFetchedTests] = useState(false);
  const [error, setError] = useState(null);

  const loadTests = async () => {
    if (hasFetchedTests || !enrolledcourseId) return;
    setLoading(true);
    try {
      // Fetch tests for the course
      const testData = await fetchTestsForCourse(enrolledcourseId);
      if (!testData) {
        setError('Failed to load tests');
        setTests([]);
        return;
      }
      setTests(testData);
      setError(null);

      // Fetch test results (optional, won't block test display)
      try {
        const results = await fetchResult();
        const resultsByTest = {};
        testData.forEach(test => {
          resultsByTest[test._id] = results.filter(result => result.testId._id === test._id);
        });
        setTestResults(resultsByTest);
      } catch (resultErr) {
        console.warn('Failed to fetch test results:', resultErr.message);
        // Don't set error state; allow tests to display
        setTestResults({});
      }
    } catch (err) {
      console.error('Error loading tests:', err);
      setError(err.message || 'Failed to load tests');
      setTests([]);
    } finally {
      setLoading(false);
      setHasFetchedTests(true);
    }
  };

  useEffect(() => {
    loadTests();
  }, [enrolledcourseId, fetchTestsForCourse, fetchResult, hasFetchedTests]);

  const checkTestAttempts = (testId) => {
    return testResults[testId] ? testResults[testId].length : 0;
  };

  const hasTakenTest = (testId) => {
    const test = tests.find(t => t._id === testId);
    const maxAttempts = test?.noOfAttempts || 1;
    const attempts = checkTestAttempts(testId);
    return attempts >= maxAttempts;
  };

  const getAttemptsLeft = (testId) => {
    const test = tests.find(t => t._id === testId);
    const maxAttempts = test?.noOfAttempts || 1;
    const attempts = checkTestAttempts(testId);
    return maxAttempts - attempts;
  };

  const handleTestAction = async (testId) => {
    const hasMaxAttempts = await hasTakenTest(testId);
    if (hasMaxAttempts) {
      navigate(`/testreview/${enrolledcourseId}/${testId}`);
    } else {
      navigate(`/taketest/${enrolledcourseId}/${testId}`);
    }
  };

  const handleReviewTest = (testId) => {
    navigate(`/testreview/${enrolledcourseId}/${testId}`);
  };

  const handleRetry = () => {
    setHasFetchedTests(false);
    setTestResults({});
    setError(null);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <ArrowPathIcon className="w-10 h-10 text-green-500 animate-spin" />
        <span className="ml-3 text-lg font-['Inter',sans-serif] text-gray-800">Loading tests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white text-red-400">
        <ExclamationTriangleIcon className="w-10 h-10 mr-3" />
        <div className="text-center">
          <span className="text-lg font-['Inter',sans-serif]">{error}</span>
          <button
            onClick={handleRetry}
            className="ml-2 text-blue-500 hover:underline text-sm font-['Inter',sans-serif]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-white min-h-screen animate-fade-in">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-['Inter',sans-serif] font-bold text-gray-800 flex items-center mb-8">
          <DocumentTextIcon className="w-10 h-10 mr-3 text-green-500" />
          Tests
        </h2>
        {tests.length === 0 ? (
          <div className="text-center text-gray-600 py-16 bg-yellow-50 rounded-lg shadow-md">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-yellow-400/70 mb-3" />
            <p className="text-lg font-['Inter',sans-serif]">No tests available for this course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">S.No.</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">Test Type</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">No of Attempts</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">Attempts Left</th>
                  <th className="px-6 py-4 text-sm font-['Inter',sans-serif] font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => {
                  const attemptsLeft = getAttemptsLeft(test._id);
                  const hasAttempts = attemptsLeft > 0;
                  const hasTakenAtLeastOne = checkTestAttempts(test._id) > 0;
                  return (
                    <tr
                      key={test._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-gray-800">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-gray-800">{test.title}</td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-gray-800">{test.testType}</td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-gray-800">{formatDuration(test.duration)}</td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-gray-800">{test.noOfAttempts || 1}</td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] text-red-600">
                        {hasAttempts ? `${attemptsLeft} Attempt${attemptsLeft > 1 ? 's' : ''} Left!` : 'No Attempts Left'}
                      </td>
                      <td className="px-6 py-4 text-sm font-['Inter',sans-serif] flex space-x-2">
                        {hasAttempts && (
                          <button
                            onClick={() => handleTestAction(test._id)}
                            className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition duration-200 text-sm"
                          >
                            Start Test
                          </button>
                        )}
                        {hasTakenAtLeastOne && (
                          <button
                            onClick={() => handleReviewTest(test._id)}
                            className={`px-4 py-2 rounded-md text-white transition duration-200 text-sm ${
                              !hasAttempts ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
                            }`}
                          >
                            Review Test
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsContent;