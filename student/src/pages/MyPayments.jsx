// src/pages/MyPayments.jsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { DocumentTextIcon, CreditCardIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet';
import ReceiptDialog from '../components/ReceiptDialog';
import DownloadReceipt from '../components/DownloadReceipt';

const MyPayments = () => {
  const { fetchProtected, user, authError } = useAuthContext();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch payment history - only completed payments
  const fetchPayments = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchProtected(`${API_URL}/api/payment/mypayments`);
      const data = await response.json();
      if (response.ok) {
        // Filter only completed payments
        const completedPayments = (data.payments || []).filter(payment => payment.status === 'completed');
        setPayments(completedPayments);
        console.log('Completed Payments:', JSON.stringify(completedPayments, null, 2));
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch payment history');
        setPayments([]);
      }
    } catch (err) {
      setError(authError || err.message || 'Failed to fetch payment history');
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format time to 12-hour format with AM/PM
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Capitalize payment method
  const formatPaymentMethod = (method) => {
    if (!method || method === 'unknown') return 'N/A';
    return method
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle View Receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
  };

  // Close Receipt Dialog
  const handleCloseReceipt = () => {
    setSelectedPayment(null);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < Math.ceil(payments.length / paymentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate current payments
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

  return (
    <>
      <Helmet>
        <title>My Payments | SATScorer</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Payment History
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View all your completed transactions and download receipts
            </p>
          </div>

          {/* Stats Card */}
          {!isLoading && !error && payments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCardIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Courses Purchased</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {new Set(payments.map(p => p.courseId?._id)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your payments...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && payments.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">You haven't made any completed payments yet.</p>
            </div>
          )}

          {!isLoading && !error && payments.length > 0 && (
            <>
              {/* Payment Cards - Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {currentPayments.map((payment, index) => (
                  <div key={payment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white/80 text-xs font-medium">Payment #{indexOfFirstPayment + index + 1}</p>
                            <p className="text-white text-lg font-bold">₹{payment.amount?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Course Name */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {payment.courseId?.title || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId || 'N/A'}</p>
                      </div>

                      {/* Payment Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Payment Date</p>
                            <p className="text-gray-900 font-medium">{formatDate(payment.paymentDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ClockIcon className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Payment Time</p>
                            <p className="text-gray-900 font-medium">{formatTime(payment.paymentDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCardIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Payment Method</p>
                            <p className="text-gray-900 font-medium">{formatPaymentMethod(payment.paymentMethod)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                          View Receipt
                        </button>
                        <DownloadReceipt transaction={payment} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-600 font-medium">
                  Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, payments.length)} of {payments.length} payments
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all font-medium text-sm shadow-sm"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
                    Page {currentPage} of {Math.ceil(payments.length / paymentsPerPage)}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(payments.length / paymentsPerPage)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all font-medium text-sm shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Render ReceiptDialog when a payment is selected */}
          {selectedPayment && (
            <ReceiptDialog transaction={selectedPayment} onClose={handleCloseReceipt} />
          )}
        </div>
      </div>
    </>
  );
};

export default MyPayments;
