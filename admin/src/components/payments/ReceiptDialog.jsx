import React from 'react';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ReceiptDialog = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Payment Receipt</h2>
          <button
            className="text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Transaction Details</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === 'completed'
                  ? 'bg-blue-100 text-blue-600'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-medium text-gray-800 text-sm">{transaction.transactionId || transaction.cashfreeOrderId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cashfree Order ID</p>
              <p className="font-medium text-gray-800 text-sm">{transaction.cashfreeOrderId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-800 text-sm">
                {transaction.paymentDate
                  ? format(new Date(transaction.paymentDate), 'dd-MM-yyyy hh:mm:ss a')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-gray-800 text-sm">₹{transaction.amount?.toLocaleString('en-IN') || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-800 text-sm">{transaction.paymentMethod || 'N/A'}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">Student Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.userId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.userId?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.userId?.address || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">Course Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Course Title</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.courseId?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Exam Type</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.courseId?.examType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDialog;