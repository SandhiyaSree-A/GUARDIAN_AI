
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
    status: 'Authenticating number...', 
    risk: 'LOW' 
  });

  useEffect(() => {
    if (contact) {
      setAiAnalysis({ status: 'TRUSTED CONTACT: Bypass active.', risk: 'SAFE' });
      return;
    }
    
    // AI reputation check simulation
    const timers = [
      setTimeout(() => setAiAnalysis({ status: 'Scanning global fraud database...', risk: 'LOW' }), 800),
      setTimeout(() => setAiAnalysis({ status: 'Analyzing caller origin signature...', risk: 'MEDIUM' }), 1800),
      setTimeout(() => {
        if (number.includes('800')) {
           setAiAnalysis({ status: 'SCAM ALERT: Reported 843 times today.', risk: 'HIGH' });
        } else {
           setAiAnalysis({ status: 'SUSPICIOUS: Potential robocall pattern.', risk: 'MEDIUM' });
        }
      }, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [contact, number]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-between py-24 px-8 text-white transition-colors duration-1000 ${
      aiAnalysis.risk === 'HIGH' ? 'bg-red-600' : 'bg-slate-900'
    }`}>
      <div className="text-center w-full mt-8">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-12 border border-white/10 backdrop-blur-md">
          <i className="fas fa-shield-halved text-indigo-400"></i>
          <span>Guardian AI Intercept</span>
        </div>
        
        <div className="relative mb-8">
          <div className="w-40 h-40 bg-white/10 rounded-[60px] mx-auto flex items-center justify-center text-6xl backdrop-blur-md">
            <i className={`fas ${contact ? 'fa-user-check text-green-400' : aiAnalysis.risk === 'HIGH' ? 'fa-skull-crossbones text-red-200 animate-pulse' : 'fa-user-secret opacity-50'}`}></i>
          </div>
          {aiAnalysis.risk === 'HIGH' && (
            <div className="absolute top-0 right-1/2 translate-x-12 bg-white text-red-600 w-12 h-12 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          )}
        </div>

        <h2 className="text-4xl font-black mb-2 tracking-tight">
          {contact ? contact.name : 'Unknown Caller'}
        </h2>
        <p className="text-xl font-mono text-white/50 tracking-tighter">{number}</p>
        {!contact && <p className="text-xs text-white/30 mt-2 uppercase font-black tracking-widest">Global VOIP • Unidentified</p>}
      </div>

      <div className={`w-full p-8 rounded-[48px] border-2 transition-all duration-700 shadow-2xl ${
        aiAnalysis.risk === 'HIGH' ? 'bg-white border-white scale-105' : 'bg-white/5 border-white/10 backdrop-blur-lg'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`${RISK_COLORS[aiAnalysis.risk]} w-8 h-8 rounded-xl flex items-center justify-center text-white`}>
            <i className={`fas ${aiAnalysis.risk === 'HIGH' ? 'fa-shield-virus' : 'fa-microchip'} text-xs`}></i>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${aiAnalysis.risk === 'HIGH' ? 'text-red-600' : 'text-slate-400'}`}>
            Security Verdict
          </span>
        </div>
        <p className={`text-xl font-black leading-tight ${aiAnalysis.risk === 'HIGH' ? 'text-red-700' : 'text-white'}`}>
          {aiAnalysis.status}
        </p>
        {aiAnalysis.risk === 'HIGH' && (
          <div className="mt-4 pt-4 border-t border-red-100 space-y-2">
            <p className="text-[10px] text-red-600/70 font-bold uppercase tracking-widest">Detection Markers:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">Mass Spam</span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">Fake Identity</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-around items-center px-4 mb-8">
        <div className="flex flex-col items-center">
          <button 
            onClick={onDecline}
            className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl active:scale-90 transition-transform mb-4 border-4 border-white/10"
          >
            <i className="fas fa-phone-slash"></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Reject Call</span>
        </div>

        <div className="flex flex-col items-center">
          <button 
            onClick={onAccept}
            className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl active:scale-90 transition-transform mb-4 border-4 border-white/10"
          >
            <i className="fas fa-phone"></i>
          </button>
          <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Accept Safe</span>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallScreen;
