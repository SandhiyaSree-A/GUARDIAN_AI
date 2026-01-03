
import React from 'react';
import { CallLog } from '../types';

interface DashboardProps {
  history: CallLog[];
  onStartProtection: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onStartProtection }) => {
  const stats = {
    total: history.length,
    scams: history.filter(h => h.riskLevel === 'HIGH').length,
    safe: history.filter(h => h.riskLevel === 'SAFE').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Hero */}
      <section className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <i className="fas fa-shield-check text-white"></i>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">AI Guardian Active</span>
          </div>
          <h1 className="text-2xl font-black mb-2 leading-tight">Your phone is now guarded.</h1>
          <p className="text-indigo-100/70 text-sm mb-6 max-w-[220px]">
            Incoming unknown calls will be automatically analyzed for fraud.
          </p>
          <button 
            onClick={onStartProtection}
            className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform flex items-center justify-center space-x-2 shadow-lg"
          >
            <i className="fas fa-phone-volume"></i>
            <span>Simulate Incoming Call</span>
          </button>
        </div>
        <div className="absolute right-[-20px] top-[-20px] text-white/5 text-[150px] rotate-12 pointer-events-none">
          <i className="fas fa-shield-alt"></i>
        </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Screened</p>
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Scams Blocked</p>
          <p className="text-2xl font-black text-red-600">{stats.scams}</p>
        </div>
      </div>

      {/* Safety Status */}
      <div className="bg-green-50 rounded-3xl p-5 border border-green-100 flex items-center space-x-4">
         <div className="bg-green-100 p-2 rounded-xl">
           <i className="fas fa-check-double text-green-600"></i>
         </div>
         <div>
           <h4 className="font-bold text-green-900 text-sm">System Healthy</h4>
           <p className="text-green-800 text-[10px] uppercase tracking-tighter">Database updated 2 mins ago</p>
         </div>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Caller Protection Policy</h3>
        <div className="bg-slate-800 rounded-3xl p-5 text-white/80 text-xs leading-relaxed space-y-3">
           <div className="flex items-center space-x-3">
              <i className="fas fa-address-book text-indigo-400"></i>
              <span>Saved contacts bypass AI screening for your privacy.</span>
           </div>
           <div className="flex items-center space-x-3">
              <i className="fas fa-fingerprint text-indigo-400"></i>
              <span>Unknown numbers undergo reputation & behavior analysis.</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
