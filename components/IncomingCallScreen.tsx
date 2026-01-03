
import React, { useState, useEffect } from 'react';
import { Contact, RiskLevel } from '../types';
import { RISK_COLORS } from '../constants';

interface IncomingCallScreenProps {
  number: string;
  contact?: Contact;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({ number, contact, onAccept, onDecline }) => {
  const [aiAnalysis, setAiAnalysis] = useState<{ status: string; risk: RiskLevel }>({ 
    status: 'Identifying caller...', 
    risk: 'LOW' 
  });

  useEffect(() => {
    // Simulate AI Reputation Check
    const timers = [
      setTimeout(() => setAiAnalysis({ status: 'Searching global blocklists...', risk: 'LOW' }), 1000),
      setTimeout(() => setAiAnalysis({ status: 'Analyzing geographic origin...', risk: 'MEDIUM' }), 2000),
      setTimeout(() => setAiAnalysis({ status: 'HIGH RISK: Potential Robo-caller detected.', risk: 'HIGH' }), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-between py-20 px-8 text-white">
      <div className="text-center w-full">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-white/10">
          <i className="fas fa-satellite-dish mr-2 text-indigo-400"></i> AI Interceptor Active
        </div>
        
        <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl relative">
          <i className="fas fa-user-secret opacity-40"></i>
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
        </div>

        <h2 className="text-3xl font-black mb-1">Unknown Number</h2>
        <p className="text-xl font-mono text-slate-400">{number}</p>
        <p className="text-sm text-slate-500 mt-2">VoIP Service • California, USA</p>
      </div>

      <div className={`w-full p-6 rounded-[32px] border-2 transition-all duration-700 ${
        aiAnalysis.risk === 'HIGH' ? 'bg-red-950/50 border-red-500 animate-pulse' : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center space-x-4 mb-3">
          <div className={`${RISK_COLORS[aiAnalysis.risk]} p-2 rounded-lg`}>
            <i className={`fas ${aiAnalysis.risk === 'HIGH' ? 'fa-biohazard' : 'fa-magnifying-glass-chart'}`}></i>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Guardian Analysis</span>
        </div>
        <p className={`text-lg font-bold leading-tight ${aiAnalysis.risk === 'HIGH' ? 'text-red-400' : 'text-white'}`}>
          {aiAnalysis.status}
        </p>
        {aiAnalysis.risk === 'HIGH' && (
          <p className="text-xs text-red-300/60 mt-2 italic">
            Markers: Frequent short calls, reported 243 times as "Utility Scam".
          </p>
        )}
      </div>

      <div className="w-full flex justify-around items-center px-4">
        <div className="flex flex-col items-center">
          <button 
            onClick={onDecline}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-3xl shadow-2xl active:scale-90 transition-transform mb-3"
          >
            <i className="fas fa-phone-slash"></i>
          </button>
          <span className="text-xs font-bold uppercase text-slate-500">Decline</span>
        </div>

        <div className="flex flex-col items-center">
          <button 
            onClick={onAccept}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl shadow-2xl active:scale-90 transition-transform mb-3"
          >
            <i className="fas fa-phone"></i>
          </button>
          <span className="text-xs font-bold uppercase text-slate-500">Accept</span>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallScreen;
