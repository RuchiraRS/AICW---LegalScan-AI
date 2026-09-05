import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = ({ title }) => {
  return (
    <header className="h-20 bg-bg-base flex items-center justify-between px-10">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-tight font-editorial">{title}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search inspections..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent w-64 shadow-soft transition-all"
          />
        </div>
        
        <button className="relative p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-full shadow-soft border border-border">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
