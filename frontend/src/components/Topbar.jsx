import React from 'react';
import { Bell, Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 bg-bg-base border-b border-border flex items-center justify-between px-8 ml-64">
      <div className="flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search inspections, products, rules..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 relative text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
