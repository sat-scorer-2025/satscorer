import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import KpiCard from './KpiCard';
import RevenueByCourse from './RevenueByCourse';
import { CalendarIcon } from '@heroicons/react/24/outline';
import RevenuePaymentsChart from "./RevenuePaymentsChart";

const RevenueDashboard = () => {
  const { startDate, setStartDate, endDate, setEndDate, kpis, revenueData } = useOutletContext();

  return (
    <div>
      <div className="flex bg-white rounded-3xl items-center mb-6 mt-4 px-6 py-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-600 text-sm font-bold mr-2">From:</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="pl-10 p-3 text-sm border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-600 text-sm font-bold mr-2">To:</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="pl-10 p-3 text-sm border border-gray-200 rounded-full shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <KpiCard
          title="Total Revenue"
          value={`₹${kpis.totalRevenue.toLocaleString('en-IN')}`}
          icon="currency-rupee"
        />
        <KpiCard title="Total Sales" value={kpis.totalSales} icon="shopping-cart" />
        <KpiCard
          title="Average Order Value"
          value={`₹${kpis.avgOrderValue.toLocaleString('en-IN')}`}
          icon="calculator"
        />
        <KpiCard title="New Students" value={kpis.newCustomers} icon="users" />
        <KpiCard title="Revenue Growth" value={`${kpis.revenueGrowth}%`} icon="trending-up" />
      </div>
      <RevenueByCourse data={revenueData} />
      <RevenuePaymentsChart />
    </div>
  );
};

export default RevenueDashboard;