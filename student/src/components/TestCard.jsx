import React from 'react';
import { Link } from 'react-router-dom';

const TestCard = ({ test }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-base font-semibold text-gray-800">{test.title}</h3>
      <p className="text-sm text-gray-600">Exam: {test.examType}</p>
      <p className="text-sm text-gray-600">Score: {test.score}</p>
      <p className="text-sm text-gray-600">Date: {test.date}</p>
      <Link
        to={`/test/result/${test.id}`}
        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        View Result
      </Link>
    </div>
  );
};

export default TestCard;