import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TestContext } from '../../context/TestContext';
import { useNavigate } from 'react-router-dom';
import QuestionBuilder from './QuestionBuilder';
import PreviewTest from './PreviewTest';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const AddQuestions = () => {
  const { tests, createQuestions } = useContext(TestContext);
  const [selectedTest, setSelectedTest] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Filter tests to show only those with zero questions
  const availableTests = tests.filter((test) => (test.questions || []).length === 0);

  const validateQuestions = () => {
    const newErrors = {};
    if (!selectedTest) newErrors.test = 'Please select a test';
    if (questions.length === 0) newErrors.questions = 'At least one question is required';
    questions.forEach((q, i) => {
      if (!q.text?.trim()) newErrors[`question_${i}_text`] = `Question ${i + 1} text is required`;
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.options || q.options.length < 2)) {
        newErrors[`question_${i}_options`] = `Question ${i + 1} requires at least 2 options`;
      }
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.correctAnswer || (q.type === 'checkbox' && q.correctAnswer.length === 0))) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} requires at least one correct answer`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    if (!selectedTest) {
      toast.error('Please select a test before adding questions');
      return;
    }
    const newQuestion = {
      id: Date.now(),
      type: 'mcq',
      text: '',
      options: [{ text: '' }, { text: '' }],
      correctAnswer: '',
      explanation: '',
      image: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`question_${index}_text`];
      delete newErrors[`question_${index}_options`];
      delete newErrors[`question_${index}_correctAnswer`];
      return newErrors;
    });
  };

  const reorderQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleSaveQuestions = async () => {
    if (!validateQuestions()) {
      toast.error('Please fix the errors before saving.');
      return;
    }
    try {
      const questionsData = questions.map((q) => ({
        testId: selectedTest,
        text: q.text.trim(),
        type: q.type,
        options: q.options.map((opt) => ({ text: opt.text.trim(), image: opt.image || undefined })),
        correctAnswer: q.type === 'mcq' ? q.correctAnswer : q.type === 'checkbox' ? q.correctAnswer : undefined,
        explanation: q.explanation?.trim() || undefined,
        image: q.image || undefined,
      }));
      await createQuestions(questionsData);
      toast.success('Questions saved successfully!');
      setQuestions([]);
      setSelectedTest('');
      setErrors({});
      navigate('/tests/create/details');
    } catch (err) {
      toast.error(err.message || 'Failed to save questions');
    }
  };

  const testDetails = selectedTest ? tests.find((t) => t._id === selectedTest) : null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-8">
      {/* <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Add Questions to Test</h2> */}
      <div className="justify-between flex flex-row relative uppercase ">
        <label className="flex items-center text-lg text-gray-600 font-bold mx-4">Select Test</label>
        <div className="relative w-[780px]">
          <BookOpenIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className={`pl-10 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out text-gray-800 ${
              errors.test ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Select Test</option>
            {availableTests.map((test) => (
              <option key={test._id} value={test._id}>{test.title}</option>
            ))}
          </select>
        </div>
        {errors.test && <p className="text-red-500 text-sm mt-1">{errors.test}</p>}
      </div>
      {selectedTest && (
        <div>
          {questions.length === 0 && errors.questions && (
            <p className="text-red-500 text-sm mb-4">{errors.questions}</p>
          )}
          {questions.map((question, index) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              onChange={(updated) => updateQuestion(index, updated)}
              onDelete={() => deleteQuestion(index)}
              index={index}
              onReorder={reorderQuestion}
              questionsLength={questions.length}
            />
          ))}
          <div className="flex justify-between mt-6">
            <button
              onClick={addQuestion}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out"
            >
              Add Question
            </button>
            <button
              onClick={handleSaveQuestions}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200 ease-in-out"
            >
              Save Questions
            </button>
          </div>
        </div>
      )}
      {/* {showPreview && selectedTest && (
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
            <PreviewTest testDetails={testDetails} questions={questions} />
          </div>
        </div>
      )}
      {selectedTest && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out flex items-center justify-center"
            title="Preview Test"
          >
            👁️
          </button>
        </div>
      )} */}
    </div>
  );
};

export default AddQuestions;