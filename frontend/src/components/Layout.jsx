import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const location = useLocation();
  
  const getPageTitle = (path) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/inspect')) return 'New Inspection';
    if (path.includes('/results')) return 'Inspection Results';
    if (path.includes('/violations')) return 'Violations';
    if (path.includes('/settings')) return 'Settings';
    return 'LegalScan AI';
  };

  return (
    <div className="flex bg-bg-base min-h-screen font-sans text-primary">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Topbar title={getPageTitle(location.pathname)} />
        <main className="flex-1 p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
