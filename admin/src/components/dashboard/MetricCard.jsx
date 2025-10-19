import React from 'react';
import { assets } from '../../assets/assets';

const MetricCard = ({ title, value, icon, change }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={icon} 
            alt={`${title} icon`} 
            className="w-10 h-10 mr-4 p-2 rounded-full bg-blue-100"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <span 
                  className={`text-sm font-medium ${
                    change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change} 
                </span>
                <span className="text-xs text-gray-500 ml-2">from last 30 days</span>
              </div>
            )}
          </div>
        </div>
        <div className={`p-2 rounded-full ${
          change.startsWith('+') ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <svg 
            className={`w-5 h-5 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {change.startsWith('+') ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;