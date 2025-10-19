import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// Custom shape for active pie segment
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 0));
  const cos = Math.cos(-RADIAN * (midAngle ?? 0));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 15) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 15) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 35) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 35) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 25;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 8}
        outerRadius={(outerRadius ?? 0) + 12}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#1f2937"
        fontSize={12}
        fontWeight="medium"
      >{`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={16}
        textAnchor={textAnchor}
        fill="#6b7280"
        fontSize={12}
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

// Premium color palette
const COLORS = [
  "#4f46e5", // Deep Indigo
  "#a855f7", // Vibrant Purple
  "#06b6d4", // Bright Cyan
  "#f59e0b", // Warm Amber
  "#dc2626", // Rich Red
  "#059669", // Emerald Green
  "#2563eb", // Royal Blue
  "#db2777", // Magenta
  "#ea580c", // Vivid Orange
  "#16a34a", // Forest Green
];

const CustomActiveShapePieGraph = () => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState("1M");
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const fetchRevenueByCourse = async () => {
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication required");
        return;
      }

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

        // console.log("Fetching payments with params:", {
        //   startDate: startDate.toISOString(),
        //   endDate: endDate.toISOString(),
        //   allStatuses: false,
        // });

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            allStatuses: false,
          },
        });

        // console.log("API response:", res.data);

        const payments = res.data.payments || [];
        if (!Array.isArray(payments)) {
          console.error("Payments data is not an array:", payments);
          setError("Invalid payment data received");
          setData([]);
          return;
        }

        // Group revenue by course title
        const grouped = {};
        let totalRevenue = 0;

        payments.forEach((p, index) => {
          if (p.status !== "completed" || !p.courseId) {
            // console.warn(`Skipping payment at index ${index}:`, {
            //   status: p.status,
            //   courseId: p.courseId,
            // });
            return;
          }
          const name = p.courseId?.title || `Course ${p.courseId?._id || 'Unknown'}`;
          grouped[name] = (grouped[name] || 0) + (p.amount || 0);
          totalRevenue += p.amount || 0;
        });

        // console.log("Grouped revenue:", grouped);
        // console.log("Total revenue:", totalRevenue);

        // Calculate percentages and create chart data
        const chartData = Object.entries(grouped).map(([name, value], i) => ({
          name,
          value,
          percent: totalRevenue > 0 ? value / totalRevenue : 0,
          fill: COLORS[i % COLORS.length],
        }));

        // console.log("Chart data:", chartData);

        setData(chartData);
        setError(null);
      } catch (err) {
        console.error("Error fetching revenue by course:", err.response?.data || err.message);
        setError("Failed to fetch revenue data");
        setData([]);
      }
    };

    fetchRevenueByCourse();
  }, [timeRange, token]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 mt-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Revenue by Course</h2>
        <div className="flex space-x-3">
          {["1D", "1M", "1Y"].map((range) => (
            <button
              key={range}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                timeRange === range
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="text-red-500 font-medium text-center py-10">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 font-medium text-center py-10">No revenue data available</p>
      ) : (
        <div className="flex flex-row gap-6">
          {/* Left Sidebar for Course Names */}
          <div className="w-1/3 max-w-[200px] flex flex-col gap-3">
            {data.map((entry, index) => (
              <div
                key={entry.name}
                className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                  index === activeIndex ? "bg-indigo-50" : "bg-transparent"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                ></span>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
          {/* Pie Chart */}
          <div className="flex-1 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomActiveShapePieGraph;