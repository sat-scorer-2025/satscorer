import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';

const FeedbackTable = () => {
  const { feedback, setFeedback } = useOutletContext();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Categorize feedback by status, with a guard for undefined feedback
  const columns = {
    'Not Addressed': feedback ? feedback.filter((item) => !item.addressed) : [],
    Addressed: feedback ? feedback.filter((item) => item.addressed) : [],
  };

  const handleUpdateFeedback = (updatedFeedback) => {
    setFeedback(
      feedback.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item))
    );
    setSelectedFeedback(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
      {(!feedback || feedback.length === 0) ? (
        <p className="text-gray-500 text-sm">No feedback available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(columns).map((status) => (
            <div key={status} className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-700 mb-4">{status}</h3>
              {columns[status].length === 0 ? (
                <p className="text-gray-500 text-sm">No feedback</p>
              ) : (
                columns[status].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 rounded-md border border-gray-200 p-4 mb-4 shadow-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.studentName}</p>
                    <p className="text-sm text-gray-600">{item.courseName}</p>
                    <p className="text-sm text-gray-600">
                      {'★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{item.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <FeedbackModal
        open={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        feedback={selectedFeedback}
        onUpdate={handleUpdateFeedback}
      />
    </div>
  );
};

export default FeedbackTable;
