// src/components/ReceiptDialog.jsx
import React from 'react';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DownloadReceipt from './DownloadReceipt';

const ReceiptDialog = ({ transaction, onClose }) => {
  // Debug: Log transaction to inspect data structure
  console.log('ReceiptDialog Transaction:', JSON.stringify(transaction, null, 2));

  const user = transaction.userId || {};
  const course = transaction.courseId || {};
  const phone = user.phone || 'N/A';
  const examType = course.examType || 'N/A';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-full sm:max-w-3xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 font-sans">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            Payment Receipt
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <DownloadReceipt transaction={transaction} />
            <button
              className="text-gray-500 hover:bg-gray-100 rounded-full p-1.5 sm:p-2 transition-all duration-200"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
              Transaction Details
            </h3>
            <span
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                transaction.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Transaction ID</p>
              <p className="font-medium text-gray-800 text-xs sm:text-sm">
                {transaction.transactionId || transaction.cashfreeOrderId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Cashfree Order ID</p>
              <p className="font-medium text-gray-800 text-xs sm:text-sm">
                {transaction.cashfreeOrderId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-800 text-xs sm:text-sm">
                {transaction.paymentDate
                  ? format(new Date(transaction.paymentDate), 'dd/MM/yyyy hh:mm:ss a')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Amount</p>
              <p className="font-medium text-gray-800 text-xs sm:text-sm">
                ₹{transaction.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-800 text-xs sm:text-sm">
                {transaction.paymentMethod
                  ? transaction.paymentMethod
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 tracking-tight mb-2">
              Student Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {user.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {user.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {phone}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {user.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3 sm:pt-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 tracking-tight mb-2">
              Course Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Course Title</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {course.title || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Exam Type</p>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">
                  {examType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDialog;