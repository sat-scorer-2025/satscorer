import React from 'react';
import {
  CalendarIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const CoursePreviewTab = ({ formData }) => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Course Preview</h3> */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:scale-[1.02] hover:shadow-teal-100 transition-all duration-200 ease-in-out">
        <div className="relative">
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-10 select-none">
            Online
          </div>
          {formData.examType && (
            <div className="absolute top-3 right-3 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold z-10 select-none">
              {formData.examType}
            </div>
          )}
          {formData.thumbnailPreview ? (
            <img
              src={formData.thumbnailPreview}
              alt={`${formData.title} Thumbnail`}
              className="w-full h-52 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-t-2xl">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h4 className="text-xl font-bold text-gray-900 truncate">{formData.title || 'Course Title'}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AcademicCapIcon className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              Exam Type: {formData.examType || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              Start Date: {formData.startDate || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              End Date: {formData.endDate || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              Duration: {formData.durationMonths || 0} months
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UsersIcon className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              Seats: {formData.unlimitedSeats ? 'Unlimited' : formData.maxSeats || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {formData.visibility ? (
                <EyeIcon className="w-4 h-4 text-green-500 transition-transform duration-200 hover:scale-110" />
              ) : (
                <EyeSlashIcon className="w-4 h-4 text-gray-500 transition-transform duration-200 hover:scale-110" />
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  formData.visibility ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {formData.visibility ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
              <CurrencyRupeeIcon className="w-5 h-5 text-blue-500 transition-transform duration-200 hover:scale-110" />
              Price: {formData.price ? `₹${formData.price}` : 'Free'}
            </div>
          </div>
        </div>
        <div className="flex justify-between p-5 border-t border-gray-200 bg-gray-50">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm">
            Explore Course
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewTab;