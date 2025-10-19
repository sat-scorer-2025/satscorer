import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/dashboard/MetricCard';
import PopularCourses from '../components/dashboard/PopularCourses';
import TopTests from '../components/dashboard/TopTests';
import LiveSessions from '../components/dashboard/LiveSessions';
import RevenueLineChart from "../components/dashboard/RevenueLineChart";
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import CustomActiveShapePieGraph from "../components/dashboard/CustomActiveShapePieGraph";

const Dashboard = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalEnrollments: 0,
    monthlyRevenue: 0,
    studentsChange: '0%',
    enrollmentsChange: '0%',
    revenueChange: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // Calculate date ranges
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(startDate.getDate() - 30);
        const prevEndDate = new Date(startDate);

        // Fetch current period students (role: student)
        const currentStudentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { role: 'student' },
        });

        // Fetch previous period students for comparison
        const prevStudentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            role: 'student',
            createdAfter: prevStartDate.toISOString(),
            createdBefore: prevEndDate.toISOString(),
          },
        });

        const currentStudentCount = currentStudentsResponse.data.count || 0;
        const prevStudentCount = prevStudentsResponse.data.count || 0;
        const studentsChange = prevStudentCount > 0 
          ? ((currentStudentCount - prevStudentCount) / prevStudentCount * 100).toFixed(1)
          : currentStudentCount > 0 ? 100 : 0;
        const studentsChangeDisplay = studentsChange >= 0 ? `+${studentsChange}%` : `${studentsChange}%`;

        // Fetch all enrollments (current)
        const enrollmentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch previous period enrollments
        const prevEnrollmentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            createdAfter: prevStartDate.toISOString(),
            createdBefore: prevEndDate.toISOString(),
          },
        });

        const currentEnrollmentCount = enrollmentsResponse.data.count || enrollmentsResponse.data.enrollments?.length || 0;
        const prevEnrollmentCount = prevEnrollmentsResponse.data.count || prevEnrollmentsResponse.data.enrollments?.length || 0;

        const enrollmentsChange = prevEnrollmentCount > 0 
          ? ((currentEnrollmentCount - prevEnrollmentCount) / prevEnrollmentCount * 100).toFixed(1)
          : currentEnrollmentCount > 0 ? 100 : 0;
        const enrollmentsChangeDisplay = enrollmentsChange >= 0 ? `+${enrollmentsChange}%` : `${enrollmentsChange}%`;

        // Fetch revenue for last 30 days
        const paymentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allStatuses: false, // Only completed payments
          },
        });

        // Fetch previous period revenue
        const prevPaymentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: prevStartDate.toISOString(),
            endDate: prevEndDate.toISOString(),
            allStatuses: false,
          },
        });

        // Calculate total revenue
        const currentRevenue = paymentsResponse.data.payments.reduce((sum, payment) => {
          return sum + (payment.status === 'completed' && typeof payment.amount === 'number' ? payment.amount : 0);
        }, 0);

        const prevRevenue = prevPaymentsResponse.data.payments.reduce((sum, payment) => {
          return sum + (payment.status === 'completed' && typeof payment.amount === 'number' ? payment.amount : 0);
        }, 0);

        const revenueChange = prevRevenue > 0 
          ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
          : currentRevenue > 0 ? 100 : 0;
        const revenueChangeDisplay = revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`;

        setMetrics({
          totalStudents: currentStudentCount,
          totalEnrollments: currentEnrollmentCount,
          monthlyRevenue: currentRevenue,
          studentsChange: studentsChangeDisplay,
          enrollmentsChange: enrollmentsChangeDisplay,
          revenueChange: revenueChangeDisplay,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMetrics();
    }
  }, [token]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard 
          title="Total Students" 
          value={metrics.totalStudents.toLocaleString()} 
          icon={assets.user_icon} 
          change={metrics.studentsChange} 
        />
        <MetricCard 
          title="Total Course Enrollments" 
          value={metrics.totalEnrollments.toLocaleString()} 
          icon={assets.student_management_icon} 
          change={metrics.enrollmentsChange} 
        />
        <MetricCard 
          title="Revenue this Month" 
          value={`₹${metrics.monthlyRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
          icon={assets.sales_and_payments_icon} 
          change={metrics.revenueChange} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PopularCourses />
        <TopTests />
        <LiveSessions />
      </div>
      {/* Revenue Charts Section */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueLineChart />
        <CustomActiveShapePieGraph />
      </div>
    </div>
  );
};

export default Dashboard;
