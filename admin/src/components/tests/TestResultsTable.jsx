import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TestResultsTable = ({ results, isLoading, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteResultId, setDeleteResultId] = useState(null);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentResults = results.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(results.length / rowsPerPage);
  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setDeleteResultId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(deleteResultId);
    setShowConfirmModal(false);
    setDeleteResultId(null);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setDeleteResultId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Test Results</h2>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : currentResults.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-gray-600 text-lg">No results found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Student Name</th>
                <th className="p-4 border border-gray-200 text-center">Test</th>
                <th className="p-4 border border-gray-200 text-center">Exam</th>
                <th className="p-4 border border-gray-200 text-center">Date</th>
                <th className="p-4 border border-gray-200 text-center">Time</th>
                <th className="p-4 border border-gray-200 text-center">Score</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => (
                <tr
                  key={result._id}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{indexOfFirstRow + index + 1}.</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{result.userId?.name || result.userId?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{result.testId?.title || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{result.testId?.examType || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {result.completedAt ? format(new Date(result.completedAt), 'dd-MM-yyyy') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {result.completedAt ? format(new Date(result.completedAt), 'hh:mm a') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {result.score} / {result.totalScore}
                  </td>
                  <td className="px-4 py-3 flex space-x-2 justify-center">
                    <button
                      onClick={() => navigate(`/tests/result/${result._id}/review`)}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(result._id)}
                      className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-400 transition-all duration-200 ease-in-out"
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-400 transition-all duration-200 ease-in-out"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <ConfirmModal
        open={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this test result?"
      />
    </div>
  );
};

export default TestResultsTable;