// src/pages/MyPayments.jsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
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

  // Fetch payment history
  const fetchPayments = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchProtected(`${API_URL}/api/payment/mypayments`);
      const data = await response.json();
      if (response.ok) {
        setPayments(data.payments || []);
        // Debug: Log payments to inspect data structure
        console.log('Payments:', JSON.stringify(data.payments, null, 2));
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
      <div className="min-h-screen bg-gray-100 py-4 sm:py-6 md:py-8 font-sans">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-screen-2xl 2xl:max-w-screen-2xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            My Payment History
          </h1>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && payments.length === 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 text-sm sm:text-base">No payment history found.</p>
            </div>
          )}

          {!isLoading && !error && payments.length > 0 && (
            <>
              {/* Mobile View: Card Layout (visible on xs, hidden on sm+) */}
              <div className="block sm:hidden space-y-4">
                {currentPayments.map((payment, index) => (
                  <div key={payment._id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">S.No.: {indexOfFirstPayment + index + 1}</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Transaction ID:</span>
                        <span>{payment.transactionId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Course Name:</span>
                        <span>{payment.courseId?.title || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>{formatDate(payment.paymentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Time:</span>
                        <span>{formatTime(payment.paymentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Method:</span>
                        <span>{formatPaymentMethod(payment.paymentMethod)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span>₹{payment.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleViewReceipt(payment)}
                        className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                        title="View Receipt"
                      >
                        <DocumentTextIcon className="w-4 h-4 mr-1" /> View
                      </button>
                      <DownloadReceipt transaction={payment} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet View: Table Layout (hidden on xs, visible on sm+) */}
              <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-purple-500 to-indigo-500">
                      <tr>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          S.No.
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Course Name
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Payment Time
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-2 py-3 sm:px-3 md:px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPayments.map((payment, index) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {indexOfFirstPayment + index + 1}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {payment.transactionId || 'N/A'}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {payment.courseId?.title || 'N/A'}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {formatTime(payment.paymentDate)}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {formatPaymentMethod(payment.paymentMethod)}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            ₹{payment.amount?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-full ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-2 py-6 sm:px-3 md:px-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex space-x-2 sm:space-x-3">
                              <button
                                onClick={() => handleViewReceipt(payment)}
                                className="text-purple-600 hover:text-purple-800 flex items-center"
                                title="View Receipt"
                              >
                                <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <DownloadReceipt transaction={payment} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4 sm:mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {Math.ceil(payments.length / paymentsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(payments.length / paymentsPerPage)}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-all"
                >
                  Next
                </button>
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