import React from 'react';

const RevenueByCourse = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Revenue by Course</h2>
      <div className="overflow-x-auto">
        {data.length === 0 ? (
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
            <p className="mt-2 text-gray-600 text-lg">No revenue data available.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wide">
                <th className="p-4 border border-gray-200 text-left">Course</th>
                <th className="p-4 border border-gray-200 text-left">Revenue</th>
                <th className="p-4 border border-gray-200 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-sm uppercase">{item.course}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-sm">₹{item.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-800 border border-gray-200 text-sm">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RevenueByCourse;