import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamSelectionModal = ({ onClose, testType = null }) => {
  const [selectedExam, setSelectedExam] = useState('');
  const navigate = useNavigate();

  const exams = ['SAT', 'GRE', 'GMAT', 'IELTS', 'ACT', 'AP'];

  const handleStartTest = () => {
    if (!selectedExam) {
      alert('Please select an exam.');
      return;
    }
    navigate(`/free-test/${selectedExam}`, { state: { testType } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Poppins']">Select an Exam</h2>
        <p className="text-gray-600 mb-6">Choose the exam type to start your free test</p>

        {/* Exam Options as Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {exams.map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200 ${
                selectedExam === exam
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleStartTest}
            className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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