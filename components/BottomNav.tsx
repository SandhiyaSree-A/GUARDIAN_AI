
import React from 'react';

interface BottomNavProps {
  activeTab: 'home' | 'history' | 'settings';
  onTabChange: (tab: 'home' | 'history' | 'settings') => void;
  onStartCall: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onStartCall }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-inset-bottom z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center w-full transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-house text-lg mb-1"></i>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>

        <div className="relative -top-6">
          <button 
            onClick={onStartCall}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-300 transform active:scale-90 transition-transform"
          >
            <i className="fas fa-shield-halved text-xl"></i>
          </button>
        </div>

        <button 
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center w-full transition-colors ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-clock-rotate-left text-lg mb-1"></i>
          <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
        </button>

        <button 
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center w-full transition-colors ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-user-shield text-lg mb-1"></i>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
