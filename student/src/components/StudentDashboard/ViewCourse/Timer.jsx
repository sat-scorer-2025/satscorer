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

  // Determine color based on time remaining
  const getTimerColor = () => {
    const percentRemaining = (timeLeft / totalDuration) * 100;
    if (percentRemaining <= 10) return { bg: 'bg-red-50', text: 'text-red-600', stroke: '#ef4444', border: 'border-red-200' };
    if (percentRemaining <= 25) return { bg: 'bg-amber-50', text: 'text-amber-600', stroke: '#f59e0b', border: 'border-amber-200' };
    return { bg: 'bg-blue-50', text: 'text-blue-600', stroke: '#3b82f6', border: 'border-blue-200' };
  };

  const colors = getTimerColor();

  return (
    <div className={`flex flex-col items-center justify-center ${colors.bg} p-3 rounded-lg border ${colors.border} shadow-sm`}>
      <div className="flex items-center gap-1.5 mb-2">
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-['Inter',sans-serif] font-medium text-gray-600">
          Time Left
        </span>
      </div>
      
      <div className="relative">
        <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            className="transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg sm:text-xl font-['Inter',sans-serif] font-bold ${colors.text}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="mt-2 px-2 py-0.5 bg-red-100 rounded text-xs font-['Inter',sans-serif] font-semibold text-red-700 animate-pulse">
          Hurry!
        </div>
      )}
    </div>
  );
};

export default Timer;