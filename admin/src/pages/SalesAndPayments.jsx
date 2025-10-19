import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SalesAndPayments = () => {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [transactions, setTransactions] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
    newCustomers: 0,
    revenueGrowth: 0,
  });
  const [courses, setCourses] = useState(['All Courses']);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (fetchAllStatuses = true) => {
    setIsLoading(true);
    try {
      const periodDuration = endDate.getTime() - startDate.getTime();
      const previousEndDate = new Date(startDate.getTime() - 1000 * 60 * 60 * 24);
      const previousStartDate = new Date(previousEndDate.getTime() - periodDuration);

      const [paymentResponse, previousPaymentResponse, courseResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allStatuses: fetchAllStatuses,
          },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: previousStartDate.toISOString(),
            endDate: previousEndDate.toISOString(),
            allStatuses: false,
          },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payments = paymentResponse.data.payments || [];
      const previousPayments = previousPaymentResponse.data.payments || [];
      const coursesData = courseResponse.data.courses || [];

      const courseOptions = ['All Courses', ...coursesData.map((course) => course.title)];
      setCourses(courseOptions);

      const filteredTransactions = payments.filter((txn) => {
        const txnDate = new Date(txn.paymentDate);
        return (
          txnDate >= startDate &&
          txnDate <= endDate &&
          (selectedCourse === 'All Courses' || txn.courseId?.title === selectedCourse) &&
          (searchQuery === '' ||
            txn.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.cashfreeOrderId?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });

      filteredTransactions.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

      const completedTransactions = payments.filter(
        (txn) => txn.status === 'completed' && new Date(txn.paymentDate) >= startDate && new Date(txn.paymentDate) <= endDate
      );
      const totalRevenue = completedTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
      const totalSales = completedTransactions.length;
      const avgOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;
      const newCustomers = new Set(completedTransactions.map((txn) => txn.userId?._id)).size;

      const previousRevenue = previousPayments.reduce((sum, txn) => sum + (txn.amount || 0), 0);
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(2) : 0;

      setKpis({
        totalRevenue,
        totalSales,
        avgOrderValue,
        newCustomers,
        revenueGrowth,
      });

      const revenueByCourse = coursesData
        .map((course) => {
          const coursePayments = completedTransactions.filter((txn) => txn.courseId?._id === course._id);
          const courseRevenue = coursePayments.reduce((sum, txn) => sum + (txn.amount || 0), 0);
          return {
            course: course.title,
            revenue: courseRevenue,
            percentage: totalRevenue > 0 ? Math.round((courseRevenue / totalRevenue) * 100) : 0,
          };
        })
        .filter((item) => item.revenue > 0);

      setRevenueData(revenueByCourse);
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData(true);
    }
  }, [token, startDate, endDate, selectedCourse, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-16 z-10 bg-white shadow-md">
      <div className="sticky top-16 z-10 bg-gradient-to-r from-blue-900/10 to-purple-500/10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight p-6">Sales and Payments Dashboard</h1>
        <div className="flex border-b border-gray-200 px-6">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Revenue Dashboard
          </NavLink>
          <NavLink
            to="history"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-md transition-all duration-200 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Purchase History
          </NavLink>
        </div>
      </div>
      </div>
      <div className="p-4 relative">
        <Outlet context={{ startDate, setStartDate, endDate, setEndDate, searchQuery, setSearchQuery, selectedCourse, setSelectedCourse, courses, transactions, revenueData, kpis, isLoading }} />
      </div>
    </div>
  );
};

export default SalesAndPayments;