import React from 'react';

const Timer = ({ timeLeft, totalDuration }) => {
  // Manual prop validation
  if (typeof timeLeft !== 'number' || timeLeft < 0) {
    timeLeft = 0;
  }
  if (typeof totalDuration !== 'number' || totalDuration <= 0) {
    totalDuration = 0;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
      <svg className="w-24 h-24 mr-2" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dy=".3em"
          className="text-2xl font-['Inter',sans-serif] font-semibold text-gray-900"
        >
          {formatTime(timeLeft)}
        </text>
      </svg>
    </div>
  );
};

export default Timer;