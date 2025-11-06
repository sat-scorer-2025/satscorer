import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const TestReview = () => {
  const { enrolledcourseId, testId } = useParams();
  const navigate = useNavigate();
  const { fetchReviewData } = useStudentContext();
  const [test, setTest] = useState(null);
  const [result, setResult] = useState(null);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReviewData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReviewData(testId);
      if (!data.test || !data.result || !data.totalPossibleMarks) {
        setError('Failed to load test review data');
        return;
      }
      setTest(data.test);
      setResult(data.result);
      setTotalPossibleMarks(data.totalPossibleMarks);
    } catch (err) {
      setError(err.message || 'Failed to load test review data');
    } finally {
      setLoading(false);
    }
  }, [testId, fetchReviewData]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, test]);

  const handleQuestionClick = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  const isAttempted = (questionId) => {
    const answer = result.answers.find(ans => ans.questionId._id === questionId);
    if (!answer) return false;
    
    if (answer.selectedAnswer === null || answer.selectedAnswer === undefined || answer.selectedAnswer === '') {
      return false;
    }
    
    if (Array.isArray(answer.selectedAnswer) && answer.selectedAnswer.length === 0) {
      return false;
    }
    
    return true;
  };

  const isCorrect = (questionId) => {
    const answer = result.answers.find(ans => ans.questionId._id === questionId);
    if (!answer) return false;
    const question = test.questions.find(q => q._id === questionId);
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

  const getQuestionStatus = (questionId) => {
    if (!isAttempted(questionId)) return 'not-attempted';
    return isCorrect(questionId) ? 'correct' : 'incorrect';
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Loading test review...</p>
      </div>
    );
  }

  if (error || !test || !result || totalPossibleMarks === null) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">{error || 'No review data available'}</p>
        <button
          onClick={() => navigate(`/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests`)}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  const question = test.questions[currentQuestionIndex];
  const answer = result.answers.find(ans => ans.questionId._id === question._id);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pr-80 overflow-y-auto">
        <div className="w-full">
          {/* Question Header */}
          <div className="mb-6 bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-['Inter',sans-serif] font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </h2>
              {(question.type === 'mcq' || question.type === 'checkbox') && (
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                  getQuestionStatus(question._id) === 'correct'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : getQuestionStatus(question._id) === 'not-attempted'
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-rose-100 text-rose-700 border border-rose-300'
                }`}>
                  {getQuestionStatus(question._id) === 'correct' 
                    ? '✓ Correct' 
                    : getQuestionStatus(question._id) === 'not-attempted'
                    ? '○ Not Attempted'
                    : '✗ Incorrect'}
                </div>
              )}
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-6 bg-white p-6 lg:p-7 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                Question
              </span>
            </div>
            <p className="text-base sm:text-base lg:text-lg font-['Inter',sans-serif] text-gray-900 mb-4 leading-relaxed">
              {question.text}
            </p>
            {question.image && (
              <div className="mt-5 flex justify-center">
                <img
                  src={question.image}
                  alt="Question"
                  className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="bg-white p-6 lg:p-7 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Answer Options
              </span>
            </div>
            {(question.type === 'mcq' || question.type === 'checkbox') && (
              <div className="space-y-3">
                {!isAttempted(question._id) && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                    <p className="text-sm font-['Inter',sans-serif] text-amber-800 flex items-center gap-2">
                      <span className="text-lg">⚠</span>
                      <span>You did not attempt this question.</span>
                    </p>
                  </div>
                )}
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
                      className={`flex items-start p-4 rounded-xl border-2 transition-all duration-200 ${
                        isCorrectOption 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-sm' 
                          : isSelected 
                          ? 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 shadow-sm' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="mr-3 mt-0.5 flex-shrink-0">
                        {isCorrectOption ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                        ) : isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                            <XCircleIcon className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm sm:text-base font-['Inter',sans-serif] leading-relaxed ${
                          isCorrectOption ? 'text-gray-900 font-medium' : 'text-gray-800'
                        }`}>
                          {option.text}
                        </span>
                        {isCorrectOption && (
                          <span className="ml-2 text-xs font-semibold text-emerald-600">
                            (Correct Answer)
                          </span>
                        )}
                        {isSelected && !isCorrectOption && (
                          <span className="ml-2 text-xs font-semibold text-rose-600">
                            (Your Answer)
                          </span>
                        )}
                        {option.image && (
                          <div className="mt-3 flex justify-center lg:justify-start">
                            <img
                              src={option.image}
                              alt={`Option ${idx + 1}`}
                              className="max-w-full lg:max-w-sm h-auto rounded-lg shadow-md border border-gray-200"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {(question.type === 'short' || question.type === 'paragraph') && (
              <div className="space-y-4">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <p className="text-xs font-['Inter',sans-serif] font-semibold text-gray-600 uppercase tracking-wide">
                      Your Answer
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-['Inter',sans-serif] text-gray-900 leading-relaxed">
                    {answer?.selectedAnswer || 'No answer provided'}
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <p className="text-xs font-['Inter',sans-serif] font-semibold text-emerald-700 uppercase tracking-wide">
                      Correct Answer
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-['Inter',sans-serif] text-gray-900 leading-relaxed">
                    {question.correctAnswer || 'Not specified'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 lg:p-7 rounded-xl border border-slate-200 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-['Inter',sans-serif] font-semibold text-slate-900 mb-3">Explanation</p>
                  <p className="text-sm sm:text-base font-['Inter',sans-serif] text-gray-700 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-72 bg-white border-t border-gray-200 px-4 py-3 lg:px-10 shadow-xl z-30">
          <div className="w-full flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-5 lg:px-6 py-2.5 lg:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-all border border-gray-300"
              >
                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === test.questions.length - 1}
                className="px-5 lg:px-6 py-2.5 lg:py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-all shadow-sm"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </div>
            <button
              onClick={() => navigate(`/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests`)}
              className="px-5 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 flex items-center justify-center text-sm sm:text-base font-medium transition-all shadow-sm"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed on desktop, hidden on mobile */}
      <div className="hidden lg:flex fixed right-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-50 to-white shadow-2xl z-40 flex-col border-l border-gray-200">
        {/* Score Display - Always visible at top */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="text-center">
            <p className="text-xs font-['Inter',sans-serif] font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Your Score
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-['Inter',sans-serif] font-bold text-slate-800">{result.score}</span>
                <span className="text-xl font-['Inter',sans-serif] font-medium text-gray-400">/</span>
                <span className="text-2xl font-['Inter',sans-serif] font-semibold text-gray-600">{totalPossibleMarks}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-500"
                      style={{ width: `${(result.score / totalPossibleMarks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-['Inter',sans-serif] font-semibold text-slate-700">
                    {Math.round((result.score / totalPossibleMarks) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="text-xs font-['Inter',sans-serif] font-bold text-gray-600 uppercase tracking-wider mb-4 sticky top-0 bg-white pb-2">
            Questions
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {test.questions.map((q, i) => {
              const status = getQuestionStatus(q._id);
              return (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-['Inter',sans-serif] font-semibold transition-all duration-200 ${
                    i === currentQuestionIndex
                      ? 'bg-slate-700 text-white shadow-lg scale-110 ring-2 ring-slate-400 ring-offset-2'
                      : status === 'correct'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200'
                      : status === 'not-attempted'
                      ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                      : 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200'
                  }`}
                  title={`Question ${i + 1} - ${
                    status === 'correct' ? 'Correct' : status === 'not-attempted' ? 'Not Attempted' : 'Incorrect'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-5 border-t border-gray-200 bg-white">
          <p className="text-xs font-['Inter',sans-serif] font-bold text-gray-600 uppercase tracking-wider mb-3">
            Legend
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-slate-700 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Current Question</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 border border-emerald-300"></div>
              <span className="text-gray-700 font-medium">Correct Answer</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-rose-100 border border-rose-300"></div>
              <span className="text-gray-700 font-medium">Incorrect Answer</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-amber-100 border border-amber-300"></div>
              <span className="text-gray-700 font-medium">Not Attempted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Score Display - Floating */}
      <div className="lg:hidden fixed top-3 right-3 z-40 bg-white rounded-xl shadow-xl border border-gray-200 p-3">
        <div className="text-center">
          <p className="text-xs font-['Inter',sans-serif] font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Score
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-['Inter',sans-serif] font-bold text-slate-800">{result.score}</span>
            <span className="text-sm font-['Inter',sans-serif] text-gray-400">/</span>
            <span className="text-lg font-['Inter',sans-serif] font-semibold text-gray-600">{totalPossibleMarks}</span>
          </div>
          <div className="mt-1 text-xs font-['Inter',sans-serif] font-semibold text-slate-600">
            {Math.round((result.score / totalPossibleMarks) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReview;