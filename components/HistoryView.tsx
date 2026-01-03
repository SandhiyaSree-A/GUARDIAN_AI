
import React, { useState, useEffect } from 'react';
import { CallLog } from '../types';
import { RISK_COLORS, RISK_TEXT_COLORS } from '../constants';

interface HistoryViewProps {
  history: CallLog[];
  onReportSpam: (id: string) => void;
  onUnreportSpam: (id: string) => void;
  onClearAll: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onReportSpam, onUnreportSpam, onClearAll }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  const getUnreportTimeLeft = (reportedAt?: number) => {
    if (!reportedAt) return null;
    const dayInMs = 24 * 60 * 60 * 1000;
    const expiry = reportedAt + dayInMs;
    const left = expiry - now;
    if (left <= 0) return null;
    
    const hours = Math.floor(left / (1000 * 60 * 60));
    const mins = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left to unreport`;
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Call History</h2>
        {history.length > 0 && (
          <button onClick={onClearAll} className="text-indigo-600 text-[10px] font-black uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Clear Logs
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 opacity-40">
          <i className="fas fa-shield-slash text-5xl mb-4"></i>
          <p className="font-bold text-sm uppercase tracking-widest">Safe & Quiet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((call) => {
            const unreportTimer = getUnreportTimeLeft(call.reportedAt);
            const isReported = !!call.reportedAt;

            return (
              <div key={call.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`${RISK_COLORS[call.riskLevel]} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-50`}>
                      <i className={`fas ${call.isBlocked ? 'fa-ban' : call.riskLevel === 'HIGH' ? 'fa-shield-virus' : 'fa-phone-alt'} text-lg`}></i>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 truncate max-w-[150px]">
                        {call.callerId || "Unknown"}
                      </h3>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        {new Date(call.timestamp).toLocaleDateString()} • {Math.floor(call.duration / 60)}m {call.duration % 60}s
                      </p>
                    </div>
                  </div>
                  <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border-2 ${RISK_TEXT_COLORS[call.riskLevel]} border-current`}>
                    {call.isBlocked ? 'BLOCKED' : call.riskLevel}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
                    "{call.summary}"
                  </p>
                  
                  {expandedId === call.id && (
                    <div className="mt-4 space-y-4 animate-fadeIn">
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Transcript Analysis</p>
                         <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl font-mono leading-relaxed border border-slate-100">
                           {call.transcript || "Conversation not recorded for privacy."}
                         </p>
                      </div>
                      {call.scamMarkers.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Scam Fingerprints</p>
                          <div className="flex flex-wrap gap-2">
                            {call.scamMarkers.map(m => (
                              <span key={m} className="bg-red-50 text-red-600 text-[10px] px-3 py-1 rounded-full font-black border border-red-100 uppercase">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  {isReported && unreportTimer ? (
                    <button 
                      onClick={() => onUnreportSpam(call.id)}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100"
                    >
                      <i className="fas fa-undo mr-1"></i> Retract Spam
                      <div className="text-[8px] opacity-70 mt-1">{unreportTimer}</div>
                    </button>
                  ) : !call.isBlocked && (
                    <button 
                      onClick={() => onReportSpam(call.id)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <i className="fas fa-flag mr-1"></i> Report Spam
                    </button>
                  )}
                  <button 
                    onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-colors ${expandedId === call.id ? 'bg-slate-800 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}
                  >
                    <i className={`fas ${expandedId === call.id ? 'fa-eye-slash' : 'fa-chart-pie'} mr-1`}></i> 
                    {expandedId === call.id ? 'Hide Logic' : 'View Logic'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
