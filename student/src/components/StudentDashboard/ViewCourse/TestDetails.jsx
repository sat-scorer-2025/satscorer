import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

const TestDetails = ({ test, questionsLength, onStart }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    return `${minutes}m`;
  };

  const instructions = `
- **Test Instructions:**
  - You have ${formatDuration(test.duration)} to complete the test.
  - Mark your answers clearly in the provided input fields.
  - Use scratch paper for calculations (no calculators unless specified).
  - Do not leave your seat or communicate with others during the test.
  - Answer all questions to the best of your ability.
  - The timer will alert you when 5 minutes remain.
  - Review your answers before the time expires.
  - Each question is worth ${test.markingScheme?.marksPerQuestion || 1} mark${(test.markingScheme?.marksPerQuestion || 1) > 1 ? 's' : ''}.
`;

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 border-l-4 border-blue-500">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-['Inter',sans-serif] font-bold text-gray-900 flex items-center flex-wrap gap-3">
            <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 flex-shrink-0" />
            <span className="break-words">{test.title}</span>
          </h1>
        </div>

        {/* Description and Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-['Inter',sans-serif] font-semibold text-gray-800 mb-4">
            Description
          </h2>
          <p className="text-sm sm:text-base font-['Inter',sans-serif] text-gray-700 mb-6 leading-relaxed">
            {test.description || 'No description available'}
          </p>
          
          <h2 className="text-lg sm:text-xl font-['Inter',sans-serif] font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm font-['Inter',sans-serif] text-gray-800 whitespace-pre-line leading-relaxed">
              {instructions}
            </p>
          </div>
        </div>

        {/* Test Details Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-['Inter',sans-serif] font-semibold text-gray-800 mb-6">
            Test Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Exam Type</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900 break-words">
                {test.examType}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 sm:p-5 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Test Type</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900 break-words">
                {test.testType}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 sm:p-5 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Duration</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900">
                {formatDuration(test.duration)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-4 sm:p-5 rounded-lg border border-amber-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Attempts</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900">
                {test.noOfAttempts || 1}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-4 sm:p-5 rounded-lg border border-pink-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Questions</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900">
                {questionsLength}
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white p-4 sm:p-5 rounded-lg border border-cyan-200 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-['Inter',sans-serif] text-gray-500 uppercase mb-2">Marks per Question</p>
              <p className="text-base sm:text-lg lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-900">
                {test.markingScheme?.marksPerQuestion || 1}
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-base sm:text-lg font-['Inter',sans-serif] font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            START TEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;