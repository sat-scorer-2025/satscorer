import React, { useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { TestContext } from '../../context/TestContext';
import TestHeader from './TestHeader';
import QuestionBuilder from './QuestionBuilder';
import { XMarkIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';

const EditTestDrawer = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { courses, examTypes, testTypes, tests, updateTest, createQuestions, updateQuestion, deleteQuestion, fetchQuestions, fetchTests } = useContext(TestContext);

  const test = useMemo(() => tests.find((t) => t._id === testId), [tests, testId]);

  const initialFormData = useMemo(() => {
    if (test) {
      return {
        _id: test._id,
        courseId: test.courseId,
        testType: test.testType,
        examType: test.examType,
        title: test.title,
        description: test.description,
        duration: test.duration,
        noOfAttempts: test.noOfAttempts,
        marksPerQuestion: test.markingScheme?.marksPerQuestion || 1,
        status: test.status,
        questions: test.questions || [],
      };
    }
    return {
      _id: '',
      courseId: '',
      testType: '',
      examType: '',
      title: '',
      description: '',
      duration: '',
      noOfAttempts: 1,
      marksPerQuestion: 1,
      status: 'draft',
      questions: [],
    };
  }, [test]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSubmittingQuestions, setIsSubmittingQuestions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const validateDetails = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.course = 'Course is required';
    if (!formData.testType) newErrors.testType = 'Test type is required';
    if (!formData.examType) newErrors.examType = 'Exam type is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.noOfAttempts || formData.noOfAttempts < 1) newErrors.attempts = 'At least one attempt is required';
    if (!formData.marksPerQuestion || formData.marksPerQuestion < 1) newErrors.marksPerQuestion = 'Marks per question must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestions = () => {
    const newErrors = {};
    if (formData.questions.length === 0) newErrors.questions = 'At least one question is required';
    formData.questions.forEach((q, i) => {
      if (!q.text?.trim()) newErrors[`question_${i}_text`] = `Question ${i + 1} text is required`;
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.options || q.options.length < 2)) {
        newErrors[`question_${i}_options`] = `Question ${i + 1} requires at least 2 options`;
      }
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.correctAnswer || (q.type === 'checkbox' && q.correctAnswer.length === 0))) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} requires at least one correct answer`;
      }
      if (q.type === 'checkbox' && Array.isArray(q.correctAnswer) && q.correctAnswer.length === q.options?.length) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} cannot have all options as correct`;
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateQuestionLocal = (index, updatedQuestion) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setFormData({ ...formData, questions: newQuestions });
    setErrors((prev) => ({
      ...prev,
      [`question_${index}_text`]: '',
      [`question_${index}_options`]: '',
      [`question_${index}_correctAnswer`]: '',
    }));
  };

  const deleteQuestionLocal = async (index) => {
    const question = formData.questions[index];
    if (question._id) {
      try {
        await deleteQuestion(question._id, formData._id);
        toast.success(`Question ${index + 1} deleted!`);
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`question_${index}_text`];
      delete newErrors[`question_${index}_options`];
      delete newErrors[`question_${index}_correctAnswer`];
      return newErrors;
    });
  };

  const reorderQuestion = (index, direction) => {
    const newQuestions = [...formData.questions];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      type: 'mcq',
      text: '',
      options: [{ text: '' }, { text: '' }],
      correctAnswer: '',
      explanation: '',
      image: null,
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
    setErrors((prev) => ({ ...prev, questions: '' }));
  };

  const handleSaveDetails = async () => {
    if (!validateDetails()) {
      toast.error('All details are required before saving.');
      return;
    }
    setIsSubmittingDetails(true);
    try {
      const testData = {
        courseId: formData.courseId,
        testType: formData.testType,
        examType: formData.examType,
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        noOfAttempts: parseInt(formData.noOfAttempts),
        markingScheme: { marksPerQuestion: parseInt(formData.marksPerQuestion) },
        status: formData.status,
      };
      await updateTest(formData._id, testData);
      toast.success('Test details updated!');
      setShowDetails(false);
      navigate('/tests/manage');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleUpdateQuestions = async () => {
    if (!validateQuestions()) {
      toast.error('All details are required before updating questions.');
      return;
    }
    setIsSubmittingQuestions(true);
    try {
      const existingQuestions = (await fetchQuestions(formData._id)) || [];
      const existingQuestionIds = existingQuestions.map((q) => q._id) || [];

      const updatedQuestions = [];
      const newQuestions = [];

      for (const q of formData.questions) {
        const questionData = {
          testId: formData._id,
          text: q.text.trim(),
          type: q.type,
          options: q.options.map((opt) => ({ text: opt.text.trim(), image: opt.image || undefined })),
          correctAnswer: q.type === 'checkbox' ? (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]) : q.correctAnswer,
          explanation: q.explanation?.trim() || undefined,
          image: q.image || undefined,
        };

        if (q._id && existingQuestionIds.includes(q._id)) {
          const response = await updateQuestion(q._id, questionData);
          updatedQuestions.push(response.question);
        } else {
          newQuestions.push(questionData);
        }
      }

      if (newQuestions.length > 0) {
        const response = await createQuestions(newQuestions);
        updatedQuestions.push(...(response.questions || []));
      }

      await updateTest(formData._id, { questions: updatedQuestions.map((q) => q._id) });

      await fetchQuestions(formData._id);
      await fetchTests();
      toast.success('Questions updated successfully!');
      navigate('/tests/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to update questions');
    } finally {
      setIsSubmittingQuestions(false);
    }
  };

  if (!test) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 z-50 overflow-y-auto">
        <div className="p-8">
          <p className="text-red-500 text-sm">Test not found.</p>
          <button
            onClick={() => navigate('/tests/manage')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out text-sm font-semibold"
          >
            Back to Manage Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 z-[100] overflow-y-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Edit Test</h2>
          <button
            onClick={() => navigate('/tests/manage')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmittingDetails || isSubmittingQuestions}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out text-sm font-semibold"
        >
          <span>Test Details</span>
          <ChevronDownIcon
            className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
          />
        </button>

        {showDetails && (
          <div className="bg-white p-6 rounded-2xl mt-4 mb-6 border border-gray-100 shadow-sm">
            <TestHeader
              selectedCourse={formData.courseId}
              setSelectedCourse={(value) => handleFieldChange('courseId', value)}
              testType={formData.testType}
              setTestType={(value) => handleFieldChange('testType', value)}
              examType={formData.examType}
              setExamType={(value) => handleFieldChange('examType', value)}
              title={formData.title}
              setTitle={(value) => handleFieldChange('title', value)}
              description={formData.description}
              setDescription={(value) => handleFieldChange('description', value)}
              duration={formData.duration}
              setDuration={(value) => handleFieldChange('duration', value)}
              attempts={formData.noOfAttempts}
              setAttempts={(value) => handleFieldChange('noOfAttempts', value)}
              marksPerQuestion={formData.marksPerQuestion}
              setMarksPerQuestion={(value) => handleFieldChange('marksPerQuestion', value)}
              errors={errors}
              examTypes={examTypes}
              testTypes={testTypes}
              courses={courses}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8 text-sm"
                  disabled={isSubmittingDetails}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveDetails}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out text-sm font-semibold disabled:opacity-50"
                disabled={isSubmittingDetails}
              >
                {isSubmittingDetails ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Questions</h3>
          {formData.questions.length === 0 && errors.questions && (
            <p className="text-red-500 text-sm">{errors.questions}</p>
          )}
          {formData.questions.map((question, index) => (
            <QuestionBuilder
              key={question._id || question.id}
              question={question}
              onChange={(updated) => updateQuestionLocal(index, updated)}
              onDelete={() => deleteQuestionLocal(index)}
              index={index}
              onReorder={reorderQuestion}
              questionsLength={formData.questions.length}
            />
          ))}
          <button
            onClick={addQuestion}
            className="flex items-center px-4 py-3 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 hover:scale-105 transition-all duration-200 ease-in-out text-sm font-semibold disabled:opacity-50"
            disabled={isSubmittingQuestions}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Question
          </button>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleUpdateQuestions}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200 ease-in-out text-sm font-semibold disabled:opacity-50"
              disabled={isSubmittingQuestions}
            >
              {isSubmittingQuestions ? 'Updating...' : 'Update Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestDrawer;