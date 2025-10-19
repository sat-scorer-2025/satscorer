import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamSelectionModal = ({ onClose, testType = null }) => {
  const [selectedExam, setSelectedExam] = useState('');
  const navigate = useNavigate();

  const exams = ['SAT', 'GRE', 'GMAT', 'IELTS', 'ACP', 'AP'];

  const handleStartTest = () => {
    if (!selectedExam) {
      alert('Please select an exam.');
      return;
    }
    navigate(`/free-test/${selectedExam}`, { state: { testType } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/50 to-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md transform transition-all duration-500 scale-95 hover:scale-100">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Select an Exam</h2>

        {/* Exam Options as Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {exams.map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`py-3 px-4 rounded-lg text-center font-semibold transition-all duration-300 shadow-md ${
                selectedExam === exam
                  ? 'bg-blue-600 text-white border-2 border-blue-700'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-md hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleStartTest}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md disabled:opacity-50"
            disabled={!selectedExam}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSelectionModal;