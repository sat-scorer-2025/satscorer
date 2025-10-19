import React, { useState } from 'react';
import { format } from 'date-fns';
import ReceiptDialog from './ReceiptDialog';
import DownloadReceipt from './DownloadReceipt';
import { EyeIcon } from '@heroicons/react/24/outline';

const PurchaseHistoryTable = ({ transactions, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Purchase History</h2>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : currentTransactions.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No transactions found.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-center">S.No.</th>
                <th className="p-4 border border-gray-200 text-center">Transaction ID</th>
                <th className="p-4 border border-gray-200 text-center">Student</th>
                <th className="p-4 border border-gray-200 text-center">Course</th>
                <th className="p-4 border border-gray-200 text-center">Date</th>
                <th className="p-4 border border-gray-200 text-center">Status</th>
                <th className="p-4 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((txn, index) => (
                <tr
                  key={txn.cashfreeOrderId || txn._id}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{indexOfFirstRow + index + 1}.</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">{txn.transactionId || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium uppercase">{txn.userId?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm uppercase">{txn.courseId?.title || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-center text-sm">
                    {txn.paymentDate ? format(new Date(txn.paymentDate), 'dd-MM-yyyy') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        txn.status === 'completed'
                          ? 'bg-blue-100 text-blue-600'
                          : txn.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {txn.status?.charAt(0).toUpperCase() + txn.status?.slice(1) || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 text-center flex flex-row justify-center gap-2">
                    <button
                      className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200"
                      onClick={() => setSelectedTransaction(txn)}
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Receipt</span>
                    </button>
                    <DownloadReceipt transaction={txn} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:bg-gray-400"
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out disabled:bg-gray-400"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
      {selectedTransaction && (
        <ReceiptDialog
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default PurchaseHistoryTable;