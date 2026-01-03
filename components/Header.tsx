
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Guardian<span className="text-indigo-600">AI</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>System Active</span>
          </div>
          <button className="text-slate-500 hover:text-slate-800 transition-colors">
            <i className="fas fa-gear text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
