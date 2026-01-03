
import React from 'react';
import { CallLog } from '../types';

interface DashboardProps {
  history: CallLog[];
  blockedCount: number;
  onStartProtection: () => void;
  onSimulateSpam: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, blockedCount, onStartProtection, onSimulateSpam }) => {
  const stats = {
    total: history.length,
    scams: history.filter(h => h.riskLevel === 'HIGH').length,
    safe: history.filter(h => h.riskLevel === 'SAFE').length,
  };

  const calculateScore = () => {
    if (stats.total === 0) return 100;
    const score = 100 - (stats.scams * 15);
    return Math.max(score, 0);
  };

  const safetyScore = calculateScore();

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Dynamic Trust Score */}
      <section className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex items-center justify-between overflow-hidden relative">
        <div className="z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Privacy Score</p>
          <h2 className={`text-5xl font-black ${safetyScore > 70 ? 'text-green-500' : safetyScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
            {safetyScore}%
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {safetyScore > 90 ? 'Perfectly Guarded' : safetyScore > 60 ? 'Actively Protected' : 'High Risk Area'}
          </p>
        </div>
        <div className="relative z-10 w-24 h-24">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
             <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={251.2} 
                strokeDashoffset={251.2 - (251.2 * safetyScore / 100)} 
                className={`${safetyScore > 70 ? 'text-green-500' : safetyScore > 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} 
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fas ${safetyScore > 70 ? 'fa-shield-check text-green-500' : 'fa-shield-exclamation text-red-500'} text-xl`}></i>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 z-0"></div>
      </section>

      {/* Action Area */}
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={onStartProtection}
          className="bg-indigo-600 p-6 rounded-[32px] text-white flex items-center justify-between shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all"
        >
          <div className="text-left">
            <h3 className="font-bold text-lg">Test Guard</h3>
            <p className="text-white/60 text-xs">Verify AI monitoring logic</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <i className="fas fa-play"></i>
          </div>
        </button>
        
        <button 
          onClick={onSimulateSpam}
          className="bg-red-50 border border-red-100 p-6 rounded-[32px] text-red-600 flex items-center justify-between active:scale-[0.98] transition-all"
        >
          <div className="text-left">
            <h3 className="font-bold text-lg">Test Scam Alert</h3>
            <p className="text-red-400 text-xs italic">Simulate known fraudulent caller</p>
          </div>
          <div className="bg-red-100 p-3 rounded-2xl">
            <i className="fas fa-skull-crossbones"></i>
          </div>
        </button>
      </div>

      {/* Protection Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[8px] font-black uppercase mb-1">Blocked</p>
          <p className="text-xl font-black text-red-600">{blockedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[8px] font-black uppercase mb-1">Analyzed</p>
          <p className="text-xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[8px] font-black uppercase mb-1">Safe</p>
          <p className="text-xl font-black text-green-600">{stats.safe}</p>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Live Feed</h3>
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
          {history.length > 0 ? (
            history.slice(0, 3).map((log, i) => (
              <div key={log.id} className={`p-4 flex items-center space-x-4 ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.riskLevel === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <i className={`fas ${log.riskLevel === 'HIGH' ? 'fa-warning' : 'fa-phone-alt'} text-xs`}></i>
                 </div>
                 <div className="flex-1">
                   <p className="text-xs font-bold text-slate-800 truncate">{log.callerId || "Unknown"}</p>
                   <p className="text-[10px] text-slate-400 font-medium truncate">{log.summary}</p>
                 </div>
                 <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic">Standing guard for your first call...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
