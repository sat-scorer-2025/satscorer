import React from 'react';

const PreviewTest = ({ testDetails, questions }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 overflow-y-auto scrollbar-hidden">
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-gray-800 rounded-md p-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Test Preview: {testDetails?.title || 'Test'}</h3>
        {testDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm"><strong>Title:</strong> {testDetails.title}</p>
              <p className="text-sm"><strong>Course:</strong> {testDetails.course || testDetails.courseId?.title || 'N/A'}</p>
              <p className="text-sm"><strong>Test Type:</strong> {testDetails.testType}</p>
              <p className="text-sm"><strong>Exam Type:</strong> {testDetails.examType}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><strong>Duration:</strong> {testDetails.duration} minute{testDetails.duration > 1 ? 's' : ''}</p>
              <p className="text-sm"><strong>Attempts:</strong> {testDetails.noOfAttempts || testDetails.attempts}</p>
              <p className="text-sm"><strong>Marking Scheme:</strong> {testDetails.markingScheme}</p>
              <p className="text-sm"><strong>Description:</strong> {testDetails.description || 'No description'}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No test details available.</p>
        )}
      </div>
      {questions.length === 0 ? (
        <p className="text-sm text-gray-600">No questions added yet.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id || index} className="border border-gray-300 rounded-md p-4">
              <div className="flex items-start">
                <span className="text-sm font-semibold text-gray-600 mr-2">{index + 1}.</span>
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{question.text || 'No question text'}</p>
                  {question.image && (
                    <img
                      src={question.image}
                      alt={`Question ${index + 1} image`}
                      className="mt-2 max-w-md rounded-md shadow-sm"
                    />
                  )}
                </div>
              </div>
              {(question.type === 'mcq' || question.type === 'checkbox') && (
                <div className="mt-3 ml-6">
                  {question.options && question.options.length > 0 ? (
                    question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center mt-2 text-sm ${
                          (question.type === 'checkbox'
                            ? question.correctAnswer?.includes(option.text)
                            : question.correctAnswer === option.text)
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        <input
                          type={question.type === 'mcq' ? 'radio' : 'checkbox'}
                          disabled
                          checked={
                            question.type === 'checkbox'
                              ? question.correctAnswer?.includes(option.text)
                              : question.correctAnswer === option.text
                          }
                          className="mr-2 text-blue-500 focus:ring-blue-500 h-4 w-4"
                        />
                        <span>{option.text || `Option ${optIndex + 1}`}</span>
                        {option.image && (
                          <img
                            src={option.image}
                            alt={`Option ${optIndex + 1} image`}
                            className="ml-3 max-w-xs rounded-md shadow-sm"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No options provided.</p>
                  )}
                </div>
              )}
              {(question.type === 'short' || question.type === 'paragraph') && (
                <div className="mt-3 ml-6">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 bg-gray-100"
                    disabled
                    placeholder={question.type === 'short' ? 'Short answer preview' : 'Long answer preview'}
                    rows={question.type === 'short' ? 2 : 4}
                  />
                </div>
              )}
              {question.explanation && (
                <div className="mt-3 ml-6">
                  <p className="text-sm font-semibold text-gray-600">Explanation:</p>
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewTest;