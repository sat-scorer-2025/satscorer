import React from 'react';
import { Outlet } from 'react-router-dom';
import ExamSidebar from './components/ExamSidebar';

const ExamsLayout = () => {

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-1">
        <ExamSidebar />
        <main className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-gray-100 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ExamsLayout;