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
    <div className="w-full bg-white p-8 flex flex-col h-screen justify-around ">
      <div>
        <div className="border-b-2 border-blue-200 py-2">
          <h1 className="text-4xl font-['Inter',sans-serif] font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="w-10 h-10 mr-3 text-gray-600 animate-pulse" />
            {test.title}
          </h1>
        </div>
        <div className="my-8">
          <p className="text-lg font-['Inter',sans-serif] text-gray-700 mb-4 leading-relaxed">{test.description || 'No description available'}</p>
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border-2 border-gray-100 shadow-inner">
            <p className="text-base font-['Inter',sans-serif] text-gray-800 whitespace-pre-line">{instructions}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Exam Type</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{test.examType}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Test Type</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{test.testType}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Duration</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{formatDuration(test.duration)}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Attempts</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{test.noOfAttempts || 1}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Questions</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{questionsLength}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm transition duration-300">
            <p className="text-sm font-['Inter',sans-serif] text-gray-500 uppercase">Marks per Question</p>
            <p className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900">{test.markingScheme?.marksPerQuestion || 1}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition duration-300 text-lg font-['Inter',sans-serif] font-bold shadow-md"
      >
        START TEST
      </button>
    </div>
  );
};

export default TestDetails;