import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { handlePayment } from '../services/PaymentGateway';

const CourseCard = ({ course }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to purchase this course.');
      navigate('/login');
      return;
    }

    const price = parseFloat(course.price);
    if (isNaN(price) || price <= 0) {
      setError('Invalid course price. Please contact support.');
      return;
    }

    const confirmPurchase = window.confirm(`Are you sure you want to buy "${course.title}" for ₹${price}?`);
    if (!confirmPurchase) return;

    setIsProcessing(true);
    setError(null);
    try {
      const result = await handlePayment(course.id, user.id, price);
      if (result && result.message.includes('enrolled')) {
        alert('Payment successful! You are now enrolled in the course.');
        navigate('/studentdashboard/mycourses');
      } else {
        throw new Error('Payment or enrollment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-xl w-72 sm:w-80">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="h-36 sm:h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          ONLINE
        </div>
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {course.examType}
        </div>
        {course.isFeatured && (
          <div className="absolute top-10 left-2 bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
            FEATURED
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{course.about}</p>
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {course.startDate} - {course.endDate}
          </span>
          <span className="font-bold text-purple-700">₹{course.price}</span>
        </div>

        {error && (
          <p className="text-red-500 text-xs sm:text-sm mb-3">{error}</p>
        )}

        <div className="flex justify-between gap-2 sm:gap-3">
          <Link
            to={`/coursedetails/${course.id}`}
            className="flex-1 text-center px-2 sm:px-3 py-1 sm:py-2 bg-white border border-purple-600 text-purple-600 rounded-full text-xs sm:text-sm font-medium hover:bg-purple-50 transition-all duration-300"
          >
            Explore
          </Link>
          <button
            onClick={handleBuyNow}
            disabled={isProcessing}
            className={`flex-1 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              isProcessing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;