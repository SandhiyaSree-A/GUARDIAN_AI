
import React from 'react';
import { CallLog } from '../types';
import { RISK_COLORS, RISK_TEXT_COLORS } from '../constants';

interface HistoryViewProps {
  history: CallLog[];
  onReportSpam: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onReportSpam }) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800">Call Log</h2>
        <button className="text-indigo-600 text-sm font-bold">Clear All</button>
      </div>

      <div className="space-y-4">
        {history.map((call) => (
          <div key={call.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className={`${RISK_COLORS[call.riskLevel]} w-10 h-10 rounded-2xl flex items-center justify-center text-white`}>
                  <i className={`fas ${call.riskLevel === 'HIGH' ? 'fa-triangle-exclamation' : 'fa-phone'}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {call.riskLevel === 'HIGH' ? 'Fraud Attempt' : 'Verified Caller'}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    {new Date(call.timestamp).toLocaleDateString()} • {Math.floor(call.duration / 60)}m {call.duration % 60}s
                  </p>
                </div>
              </div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase border ${RISK_TEXT_COLORS[call.riskLevel]} border-current`}>
                {call.riskLevel}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 italic line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              "{call.summary || call.transcript}"
            </p>

            <div className="flex space-x-2">
              <button 
                onClick={() => onReportSpam(call.id)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <i className="fas fa-flag mr-1"></i> Report Spam
              </button>
              <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
                <i className="fas fa-info-circle mr-1"></i> Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
