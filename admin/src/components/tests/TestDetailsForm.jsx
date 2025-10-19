import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { TestContext } from '../../context/TestContext';
import { useNavigate } from 'react-router-dom';
import TestHeader from './TestHeader';

const TestDetailsForm = () => {
  const { courses, examTypes, testTypes, fetchTests } = useContext(TestContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [testType, setTestType] = useState('');
  const [examType, setExamType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateDetails = () => {
    const newErrors = {};
    if (!selectedCourse) newErrors.course = 'Course is required';
    if (!testType) newErrors.testType = 'Test type is required';
    if (!examType) newErrors.examType = 'Exam type is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!duration || isNaN(duration) || duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!attempts || attempts < 1) newErrors.attempts = 'At least one attempt is required';
    if (!marksPerQuestion || marksPerQuestion < 1) newErrors.marksPerQuestion = 'Marks per question must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validateDetails()) {
      toast.error('Please fix the errors before saving.');
      return;
    }
    setIsSubmitting(true);
    try {
      const testData = {
        courseId: selectedCourse,
        testType,
        examType,
        title,
        description,
        duration: parseInt(duration),
        noOfAttempts: parseInt(attempts),
        markingScheme: { marksPerQuestion: parseInt(marksPerQuestion) },
        isFree: false,
        status,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/test`, testData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(`${title} saved as ${status}!`);
      await fetchTests();
      if (status === 'published') {
        navigate('/tests/create/questions');
      } else {
        resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCourse('');
    setTestType('');
    setExamType('');
    setTitle('');
    setDescription('');
    setDuration('');
    setAttempts(1);
    setMarksPerQuestion(1);
    setErrors({});
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Create New Test</h2>
      <TestHeader
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        testType={testType}
        setTestType={setTestType}
        examType={examType}
        setExamType={setExamType}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        duration={duration}
        setDuration={setDuration}
        attempts={attempts}
        setAttempts={setAttempts}
        marksPerQuestion={marksPerQuestion}
        setMarksPerQuestion={setMarksPerQuestion}
        errors={errors}
        examTypes={examTypes}
        testTypes={testTypes}
        courses={courses}
      />
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200 ease-in-out disabled:opacity-50"
        >
          Save Draft
        </button>
        {/* <button
          onClick={() => setShowPreview(true)}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:opacity-50"
        >
          Preview
        </button> */}
        <button
          onClick={() => handleSubmit('published')}
          disabled={isSubmitting || !selectedCourse || !testType || !examType || !title || !duration || !attempts || !marksPerQuestion}
          className={`px-6 py-3 rounded-md shadow-sm font-semibold transition-all duration-200 ease-in-out ${
            isSubmitting || !selectedCourse || !testType || !examType || !title || !duration || !attempts || !marksPerQuestion
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
          }`}
        >
          Publish Test
        </button>
      </div>
      {/* Preview Modal */}
      {/* {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Test Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p><strong>Title:</strong> {title || 'N/A'}</p>
              <p><strong>Course:</strong> {courses.find(c => c._id === selectedCourse)?.title || 'N/A'}</p>
              <p><strong>Test Type:</strong> {testType || 'N/A'}</p>
              <p><strong>Exam Type:</strong> {examType || 'N/A'}</p>
              <p><strong>Description:</strong> {description || 'N/A'}</p>
              <p><strong>Duration:</strong> {duration ? `${duration} minutes` : 'N/A'}</p>
              <p><strong>Attempts:</strong> {attempts || 'N/A'}</p>
              <p><strong>Marks per Question:</strong> {marksPerQuestion || 'N/A'}</p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TestDetailsForm;