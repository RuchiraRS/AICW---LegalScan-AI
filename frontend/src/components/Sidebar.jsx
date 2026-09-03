import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ScanSquare, Settings, ShieldAlert, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'New Inspection', path: '/inspect', icon: ScanSquare },
    { name: 'Violations', path: '/violations', icon: ShieldAlert },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-bg-card border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">LegalScan AI</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Gov Enforcement</p>
      </div>
      
      <nav className="flex-1 px-4 mt-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
            {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="text-sm">
            <p className="font-medium text-primary">{user.name || 'Unknown User'}</p>
            <p className="text-gray-500 text-xs">{user.role || 'Officer'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
