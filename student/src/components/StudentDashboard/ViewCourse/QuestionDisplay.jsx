import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Timer from './Timer';

const QuestionDisplay = ({
  question,
  questionIndex,
  totalQuestions,
  answers,
  questions,
  test,
  onAnswer,
  onPrevious,
  onNext,
  onQuestionClick,
  timeLeft,
  totalDuration,
  onSubmit,
}) => {
  // Manual prop validation
  if (!question || typeof question !== 'object' || !question._id || !question.text || !question.type) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Invalid or missing question data</p>
      </div>
    );
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">No questions available</p>
      </div>
    );
  }
  if (!test || typeof test !== 'object' || !test._id || typeof test.duration !== 'number') {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Invalid test data</p>
      </div>
    );
  }
  if (typeof answers !== 'object' || answers === null) {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Invalid answers data</p>
      </div>
    );
  }
  if (typeof onAnswer !== 'function' || typeof onPrevious !== 'function' || typeof onQuestionClick !== 'function') {
    return (
      <div className="text-center text-red-600 py-16">
        <p className="text-lg font-['Inter',sans-serif] font-semibold">Invalid callback functions</p>
      </div>
    );
  }

  const handleOptionChange = (option) => {
    onAnswer(question._id, option);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pr-80 overflow-y-auto">
        <div className="w-full">
          {/* Question Header */}
          <div className="mb-5 bg-white p-4 lg:p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl lg:text-xl font-['Inter',sans-serif] font-semibold text-gray-800">
              Question {questionIndex + 1} of {totalQuestions}
            </h2>
          </div>

          {/* Question Content */}
          <div className="mb-5 bg-white p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-base sm:text-base lg:text-lg font-['Inter',sans-serif] font-medium text-gray-800 mb-4 leading-relaxed">
              {question.text}
            </p>
            {question.image && (
              <div className="flex justify-center">
                <img
                  src={question.image}
                  alt="Question"
                  className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                  style={{ maxHeight: '450px' }}
                />
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="bg-white p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            {(question.type === 'mcq' || question.type === 'checkbox') && (
              <div className="space-y-3">
                {(question.options || []).map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-start p-4 lg:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 hover:shadow-md"
                  >
                    <input
                      type={question.type === 'mcq' ? 'radio' : 'checkbox'}
                      name={`question-${question._id}`}
                      value={option.text}
                      checked={
                        question.type === 'mcq'
                          ? answers[question._id] === option.text
                          : Array.isArray(answers[question._id]) && answers[question._id].includes(option.text)
                      }
                      onChange={() =>
                        handleOptionChange(
                          question.type === 'mcq'
                            ? option.text
                            : answers[question._id]?.includes(option.text)
                            ? answers[question._id].filter((a) => a !== option.text)
                            : [...(answers[question._id] || []), option.text]
                        )
                      }
                      className="mt-1 mr-3 w-4 h-4 flex-shrink-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-sm sm:text-base lg:text-base font-['Inter',sans-serif] text-gray-800 leading-relaxed">
                        {option.text}
                      </span>
                      {option.image && (
                        <div className="mt-3 flex justify-center lg:justify-start">
                          <img
                            src={option.image}
                            alt={`Option ${idx + 1}`}
                            className="max-w-full lg:max-w-sm h-auto rounded-lg shadow-md border border-gray-200"
                            style={{ maxHeight: '350px' }}
                          />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {(question.type === 'short' || question.type === 'paragraph') && (
              <textarea
                value={answers[question._id] || ''}
                onChange={(e) => handleOptionChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm sm:text-base lg:text-base"
                rows={question.type === 'short' ? 3 : 6}
                placeholder="Enter your answer here..."
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons - Fixed at bottom for all screens */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-72 bg-white border-t border-gray-200 px-4 py-3 lg:px-10 shadow-lg z-30">
          <div className="w-full flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              onClick={onPrevious}
              disabled={questionIndex === 0}
              className="flex-1 sm:flex-none px-5 lg:px-6 py-2.5 lg:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-all hover:shadow-md"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Previous
            </button>
            {onNext && (
              <button
                onClick={onNext}
                className="flex-1 sm:flex-none px-5 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base font-medium transition-all hover:shadow-md"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            )}
            {onSubmit && (
              <button
                onClick={onSubmit}
                className="w-full sm:w-auto px-5 lg:px-6 py-2.5 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm sm:text-base font-medium transition-all hover:shadow-md"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed on desktop, hidden on mobile (can be toggled) */}
      <div className="hidden lg:flex fixed right-0 top-0 h-screen w-72 bg-white shadow-xl z-40 flex-col">
        {/* Timer - Always visible at top */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white">
          <Timer timeLeft={timeLeft} totalDuration={totalDuration} />
        </div>

        {/* Question Palette - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-['Inter',sans-serif] font-semibold text-gray-800 mb-3 sticky top-0 bg-white pb-2">
            Question Palette
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => onQuestionClick(i)}
                className={`w-full aspect-square rounded-lg text-xs font-['Inter',sans-serif] font-medium transition-all duration-200 ${
                  i === questionIndex
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : answers[q._id]
                    ? 'bg-green-400 text-green-900 hover:bg-green-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={`Question ${i + 1}${answers[q._id] ? ' (Answered)' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span className="text-gray-700">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400"></div>
              <span className="text-gray-700">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200"></div>
              <span className="text-gray-700">Not Answered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Timer - Floating */}
      <div className="lg:hidden fixed top-3 right-3 z-40 shadow-lg">
        <Timer timeLeft={timeLeft} totalDuration={totalDuration} />
      </div>
    </div>
  );
};

export default QuestionDisplay;