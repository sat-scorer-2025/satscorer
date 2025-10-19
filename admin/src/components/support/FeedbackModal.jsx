import React, { useState } from 'react';

const FeedbackModal = ({ open, onClose, feedback, onUpdate }) => {
  if (!open || !feedback) return null;

  const [reply, setReply] = useState(feedback.reply);

  const handleSave = () => {
    onUpdate({ ...feedback, reply });
    alert('Feedback reply updated successfully.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 rounded-lg border border-gray-200 max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Feedback from {feedback.studentName}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-200 rounded-full p-2"
            aria-label="Close feedback modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <p><strong>Course:</strong> {feedback.courseName}</p>
          <p><strong>Rating:</strong> {'★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating)}</p>
          <p><strong>Comment:</strong> {feedback.comment}</p>
          <p><strong>Date:</strong> {new Date(feedback.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {feedback.addressed ? 'Addressed' : 'Not Addressed'}</p>
          <div>
            <strong>Reply:</strong>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="w-full mt-1 p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type your reply..."
              aria-label="Reply to feedback"
            />
          </div>
        </div>
        <div className="mt-6 text-right space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            aria-label="Save feedback reply"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;