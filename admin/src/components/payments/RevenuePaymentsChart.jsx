import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const RevenuePaymentsChart = () => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState("1M"); // default: last 30 days
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const endDate = new Date();
        let startDate = new Date();

        if (timeRange === "1D") {
          startDate.setDate(endDate.getDate() - 1);
        } else if (timeRange === "1M") {
          startDate.setDate(endDate.getDate() - 30);
        } else {
          startDate.setFullYear(endDate.getFullYear() - 1);
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allStatuses: false,
          },
        });

        const payments = res.data.payments || [];

        // group payments by date (or hour for 1D)
        const grouped = {};
        payments.forEach((p) => {
          if (p.status !== "completed") return;

          const date = new Date(p.paymentDate);

          let key;
          if (timeRange === "1D") {
            key = `${date.getHours()}:00`; // hourly
          } else if (timeRange === "1M") {
            key = date.toISOString().split("T")[0]; // YYYY-MM-DD
          } else {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
          }

          if (!grouped[key]) grouped[key] = { revenue: 0, payments: 0 };
          grouped[key].revenue += p.amount;
          grouped[key].payments += 1;
        });

        const dataArr = Object.entries(grouped).map(([k, v]) => ({
          date: k,
          revenue: v.revenue,
          payments: v.payments,
        }));

        setChartData(dataArr);
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    if (token) fetchChartData();
  }, [timeRange, token]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border mt-6 border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Revenue & Payments Trend</h2>
        <div className="flex space-x-2">
          {["1D", "1M", "1Y"].map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                timeRange === range
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(val, key) => (key === "revenue" ? `₹${val}` : val)} />
          <Legend />

          {/* Bar = revenue by course */}
          <Bar dataKey="revenue" barSize={25} fill="#413ea0" name="Revenue (₹)" />

          {/* Line = payments count */}
          <Line type="monotone" dataKey="payments" stroke="#ff7300" strokeWidth={3} name="Payments" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenuePaymentsChart;
