import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-bg-base flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8 ml-64 mt-20 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
