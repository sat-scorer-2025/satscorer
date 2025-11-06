// src/components/ReceiptDialog.jsx
import React from 'react';
import { format } from 'date-fns';
import { XMarkIcon, CheckCircleIcon, CalendarIcon, CreditCardIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import DownloadReceipt from './DownloadReceipt';

const ReceiptDialog = ({ transaction, onClose }) => {
  // Debug: Log transaction to inspect data structure
  console.log('ReceiptDialog Transaction:', JSON.stringify(transaction, null, 2));

  const user = transaction.userId || {};
  const course = transaction.courseId || {};
  const phone = user.phone || 'N/A';
  const examType = course.examType || 'N/A';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-3xl lg:max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Payment Receipt
              </h2>
              <p className="text-blue-100 text-sm">Transaction Confirmation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DownloadReceipt transaction={transaction} />
            <button
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-900 font-semibold text-lg">Payment Successful</p>
              <p className="text-green-700 text-sm">Your transaction has been completed successfully</p>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCardIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Transaction Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-semibold text-gray-900 text-sm break-all">
                    {transaction.transactionId || transaction.cashfreeOrderId || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Cashfree Order ID</p>
                  <p className="font-semibold text-gray-900 text-sm break-all">
                    {transaction.cashfreeOrderId || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CalendarIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {transaction.paymentDate
                        ? format(new Date(transaction.paymentDate), 'dd/MM/yyyy hh:mm:ss a')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCardIcon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {transaction.paymentMethod
                        ? transaction.paymentMethod
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Highlight */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-center">
                <p className="text-blue-100 text-sm mb-1">Total Amount Paid</p>
                <p className="text-white text-3xl font-bold">
                  ₹{transaction.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
            </div>
          </div>
          {/* Student Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Student Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.name || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <EnvelopeIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 text-sm break-all">
                    {user.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PhoneIcon className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPinIcon className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Course Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Course Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Course Title</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {course.title || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Exam Type</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {examType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-semibold">Thank you for your payment!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDialog;