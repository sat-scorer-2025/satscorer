import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const TestResultReview = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [test, setTest] = useState(null);
  const [result, setResult] = useState(null);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReviewData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/testresult/admin-review/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { test, result, totalPossibleMarks } = response.data;
      if (!test || !result || totalPossibleMarks === null) {
        setError('Failed to load test review data');
        return;
      }
      setTest(test);
      setResult(result);
      setTotalPossibleMarks(totalPossibleMarks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load test review data');
    } finally {
      setLoading(false);
    }
  }, [resultId, token]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, test]);

  const handleQuestionClick = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  const isCorrect = (questionId) => {
    const answer = result?.answers.find(ans => ans.questionId._id === questionId);
    if (!answer) return false;
    const question = test?.questions.find(q => q._id === questionId);
    if (!question) return false;

    if (question.type === 'mcq' || question.type === 'short' || question.type === 'paragraph') {
      return answer.selectedAnswer === question.correctAnswer;
    } else if (question.type === 'checkbox') {
      if (!Array.isArray(answer.selectedAnswer) || !Array.isArray(question.correctAnswer)) return false;
      const sortedUserAnswer = [...answer.selectedAnswer].sort();
      const sortedCorrectAnswer = [...question.correctAnswer].sort();
      return sortedUserAnswer.length === sortedCorrectAnswer.length &&
             sortedUserAnswer.every((val, idx) => val === sortedCorrectAnswer[idx]);
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-['Inter',sans-serif] font-semibold text-gray-600">Loading test review...</p>
      </div>
    );
  }

  if (error || !test || !result || totalPossibleMarks === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-lg font-['Inter',sans-serif] font-semibold text-red-600">{error || 'No review data available'}</p>
        <button
          onClick={() => navigate('/tests/analytics')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Back to Test Results
        </button>
      </div>
    );
  }

  const question = test.questions[currentQuestionIndex];
  const answer = result.answers.find(ans => ans.questionId._id === question._id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 w-full px-8 py-8">
        <div className="w-3/4 pr-8 flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-['Inter',sans-serif] font-semibold text-black mb-2">
              Question {currentQuestionIndex + 1}
            </h2>
            <hr className="border-t-2 border-gray-300 mb-6" />
            <div className="mb-6">
              <p className="text-lg font-['Inter',sans-serif] font-semibold text-gray-800 leading-relaxed">{question.text}</p>
              {question.image && (
                <img
                  src={question.image}
                  alt="Question"
                  className="mt-4 max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '250px' }}
                />
              )}
            </div>
            {(question.type === 'mcq' || question.type === 'checkbox') && (
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = question.type === 'mcq'
                    ? answer?.selectedAnswer === option.text
                    : answer?.selectedAnswer?.includes(option.text);
                  const isCorrectOption = question.type === 'mcq'
                    ? question.correctAnswer === option.text
                    : question.correctAnswer?.includes(option.text);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center p-3 rounded-lg transition duration-200 ${
                        isCorrectOption ? 'bg-green-100 border-green-300' : isSelected ? 'bg-red-100 border-red-300' : 'bg-white'
                      } border`}
                    >
                      <div className="mr-3">
                        {isCorrectOption ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircleIcon className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-base font-['Inter',sans-serif] font-semibold text-gray-800">{option.text}</span>
                        {option.image && (
                          <img
                            src={option.image}
                            alt={`Option ${idx + 1}`}
                            className="mt-2 max-w-[200px] h-auto rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {(question.type === 'short' || question.type === 'paragraph') && (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-base font-['Inter',sans-serif] font-semibold text-gray-800">
                    Student's Answer: {answer?.selectedAnswer || 'No answer provided'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-base font-['Inter',sans-serif] font-semibold text-gray-800">
                    Correct Answer: {question.correctAnswer || 'Not specified'}
                  </p>
                </div>
              </div>
            )}
            {question.explanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-base font-['Inter',sans-serif] font-semibold text-blue-800">Explanation:</p>
                <p className="text-base font-['Inter',sans-serif] text-gray-800">{question.explanation}</p>
              </div>
            )}
            {(question.type === 'mcq' || question.type === 'checkbox') && (
              <div className="mt-4">
                <p className="text-base font-['Inter',sans-serif] font-semibold text-gray-800">
                  Status: {isCorrect(question._id) ? (
                    <span className="text-green-600">Correct</span>
                  ) : (
                    <span className="text-red-600">Incorrect</span>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="fixed bottom-0 left-0 w-3/4 bg-gray-50 px-8 py-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-['Inter',sans-serif] flex items-center"
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-['Inter',sans-serif] flex items-center"
                disabled={currentQuestionIndex === test.questions.length - 1}
              >
                Next
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
            <button
              onClick={() => navigate('/tests/analytics')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-['Inter',sans-serif] flex items-center"
            >
              Back to Test Results
            </button>
          </div>
        </div>
        <div className="w-1/4 pl-4">
          <div className="sticky top-8 border-2 border-gray-200 rounded-lg p-4 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-['Inter',sans-serif] font-bold text-gray-900 border-b-2 border-blue-200 pb-2">
                Question Palette
              </h3>
              <p className="text-sm font-['Inter',sans-serif] text-gray-600 mt-2">
                <span className="inline-block w-3 h-3 bg-green-300 border border-green-800 mr-1"></span> Correct: Questions answered correctly.<br />
                <span className="inline-block w-3 h-3 bg-red-300 border border-red-800 mr-1"></span> Incorrect: Questions answered incorrectly.<br />
                <span className="inline-block w-3 h-3 bg-white border border-blue-600 mr-1"></span> Current: The question currently viewed.
              </p>
            </div>
            <div className="p-4 rounded-lg shadow-sm mb-4">
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border font-['Inter',sans-serif] text-sm transition duration-200 ${
                      i === currentQuestionIndex
                        ? 'bg-white text-black border-blue-600'
                        : isCorrect(q._id)
                        ? 'bg-green-300 text-green-900 border-green-800'
                        : 'bg-red-300 text-red-900 border-red-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-['Inter',sans-serif] font-semibold text-gray-800">
                Score: {result.score} / {totalPossibleMarks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultReview;