import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const RevenueLineChart = () => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState("1M"); // default last 30 days
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const endDate = new Date();
        let startDate = new Date();

        if (timeRange === "1D") {
          startDate.setDate(endDate.getDate() - 1);
        } else if (timeRange === "1M") {
          startDate.setDate(endDate.getDate() - 30);
        } else if (timeRange === "1Y") {
          startDate.setFullYear(endDate.getFullYear() - 1);
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allStatuses: false, // only completed
          },
        });

        const payments = res.data.payments || [];

        // Group by date
        const grouped = {};
        payments.forEach((p) => {
          if (p.status !== "completed") return;
          const date = new Date(p.createdAt);

          let key;
          if (timeRange === "1D") {
            key = `${date.getHours()}:00`; // hourly for last 24h
          } else if (timeRange === "1M") {
            key = date.toISOString().split("T")[0]; // YYYY-MM-DD
          } else {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
          }

          if (!grouped[key]) grouped[key] = 0;
          grouped[key] += p.amount;
        });

        const chartData = Object.entries(grouped).map(([k, v]) => ({
          name: k,
          revenue: v,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    };

    if (token) fetchRevenueData();
  }, [timeRange, token]);

  return (
    <div className="bg-white p-6 mt-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
