import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ScanSquare, ShieldAlert, Settings, FileText, BarChart2, Package, Building2, BookOpen } from 'lucide-react';
import { authAPI } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Officer Default", "role": "Enforcement"}');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'New Inspection', path: '/inspect', icon: ScanSquare },
    { name: 'Inspection History', path: '/history', icon: FileText },
    { name: 'Violations', path: '/violations', icon: ShieldAlert },
    { name: 'Product Details', path: '/products', icon: Package },
    { name: 'Manufacturers', path: '/manufacturers', icon: Building2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Rule Engine', path: '/rules', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-bg-card border-r border-border flex flex-col fixed left-0 top-0 overflow-y-auto shadow-sm">
      <div className="p-6 sticky top-0 bg-bg-card z-10 border-b border-border/50">
        <h1 className="text-2xl font-editorial font-bold tracking-tight text-primary">LegalScan AI</h1>
        <p className="text-[10px] text-accent mt-1 uppercase tracking-widest font-semibold">Gov Enforcement</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-bg-soft hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border mt-auto sticky bottom-0 bg-bg-card">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-inner">
            {user.name ? user.name.substring(0, 2).toUpperCase() : 'OF'}
          </div>
          <div className="text-sm flex-1 overflow-hidden">
            <p className="font-semibold text-primary truncate">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
