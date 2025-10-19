import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 mt-20 p-2 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;