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
    <div className="w-full bg-gray-50 p-8 flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 pr-40"> {/* Add padding to avoid overlap with sidebar */}
        <div className="mb-4">
          <h2 className="text-2xl font-['Inter',sans-serif] font-semibold text-gray-800">
            Question {questionIndex + 1} of {totalQuestions}
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-lg font-['Inter',sans-serif] font-semibold text-gray-800">{question.text}</p>
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
            {(question.options || []).map((option, idx) => (
              <label
                key={idx}
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
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
                  className="mr-3"
                />
                <span className="text-base font-['Inter',sans-serif] text-gray-800">{option.text}</span>
                {option.image && (
                  <img
                    src={option.image}
                    alt={`Option ${idx + 1}`}
                    className="mt-2 max-w-[200px] h-auto rounded-lg"
                  />
                )}
              </label>
            ))}
          </div>
        )}

        {(question.type === 'short' || question.type === 'paragraph') && (
          <textarea
            value={answers[question._id] || ''}
            onChange={(e) => handleOptionChange(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
            rows={question.type === 'short' ? 2 : 5}
            placeholder="Enter your answer"
          />
        )}

        <div className="fixed bottom-0 left-0 right-40 bg-gray-50 px-8 py-4 flex justify-start items-center z-10">
          <div className="flex space-x-4">
            <button
              onClick={onPrevious}
              disabled={questionIndex === 0}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center disabled:opacity-50"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>
            {onNext && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                Next
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
            {onSubmit && (
              <button
                onClick={onSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar with Palette and Timer */}
      <div className="fixed right-0 top-0 h-screen w-40 bg-white p-4 shadow-lg z-20">
        <div className="mb-4">
          <h3 className="text-lg font-['Inter',sans-serif] font-semibold text-gray-800 mb-2">Questions</h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => onQuestionClick(i)}
                className={`w-8 h-8 rounded-full text-sm font-['Inter',sans-serif] mx-auto ${
                  i === questionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[q._id]
                    ? 'bg-green-300 text-green-900'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <Timer timeLeft={timeLeft} totalDuration={totalDuration} />
      </div>
    </div>
  );
};

export default QuestionDisplay;