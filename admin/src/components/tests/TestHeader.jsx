import React, { useEffect } from 'react';
import { BookOpenIcon, AcademicCapIcon, PencilSquareIcon, ClockIcon, UserIcon, StarIcon } from '@heroicons/react/24/outline';

const TestHeader = ({
  selectedCourse,
  setSelectedCourse,
  testType,
  setTestType,
  examType,
  setExamType,
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  attempts,
  setAttempts,
  marksPerQuestion,
  setMarksPerQuestion,
  errors,
  examTypes,
  testTypes,
  courses,
}) => {
  // Auto-select exam type based on selected course
  useEffect(() => {
    if (selectedCourse && courses.length > 0) {
      const course = courses.find((c) => c._id === selectedCourse);
      if (course && course.examType && course.examType !== examType) {
        setExamType(course.examType);
      }
    }
  }, [selectedCourse, courses, setExamType]);

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Course</label>
            <div className="relative">
              <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.course ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Test Title</label>
            <div className="relative">
              <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter test title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
        </div>
      </div>

      {/* Test Configuration Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Exam Type</label>
            <div className="relative">
              <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed ${
                  errors.examType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                disabled
              >
                <option value="">{examType || 'Auto-selected based on course'}</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType}</p>}
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Test Type</label>
            <div className="relative">
              <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.testType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Test Type</option>
                {testTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {errors.testType && <p className="text-red-500 text-sm mt-1">{errors.testType}</p>}
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Duration (minutes)</label>
            <div className="relative">
              <ClockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="number"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                min="1"
              />
            </div>
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Attempts</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.attempts ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                min="1"
              />
            </div>
            {errors.attempts && <p className="text-red-500 text-sm mt-1">{errors.attempts}</p>}
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Marks per Question</label>
            <div className="relative">
              <StarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="number"
                placeholder="Marks per question"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(e.target.value)}
                className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                  errors.marksPerQuestion ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                min="1"
              />
            </div>
            {errors.marksPerQuestion && <p className="text-red-500 text-sm mt-1">{errors.marksPerQuestion}</p>}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
        <div className="relative">
          <label className="block text-gray-600 font-medium mb-1">Test Description</label>
          <div className="relative">
            <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
            <textarea
              placeholder="Enter test description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows="4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;