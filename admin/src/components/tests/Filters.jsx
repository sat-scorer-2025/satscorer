import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Filters = ({ searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate, selectedTest, setSelectedTest, tests }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-2">
      <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-4">Filter Test Results</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, test name, or score..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-600 text-sm font-medium mr-2">From:</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="pl-10 p-2 text-sm border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-600 text-sm font-medium mr-2">To:</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="pl-10 p-2 text-sm border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full sm:w-48 p-3 border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out appearance-none pl-4 pr-8"
            >
              <option value="">All Tests</option>
              {tests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;