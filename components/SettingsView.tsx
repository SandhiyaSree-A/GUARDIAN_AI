
import React from 'react';
import { Contact } from '../types';

interface SettingsViewProps {
  contacts?: Contact[];
  settings: {
    blockSpam: boolean;
    screenUnknown: boolean;
    autoKill: boolean;
  };
  onToggle: (key: any) => void;
  onAddContact: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  contacts = [], 
  settings, 
  onToggle, 
  onAddContact 
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <h2 className="text-2xl font-black text-slate-800 px-2">Security Hub</h2>
      
      {/* Contact Shield */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Trusted Contacts</h3>
            <p className="text-[10px] text-slate-500">Guardian automatically trusts these callers.</p>
          </div>
          <button 
            onClick={onAddContact}
            className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
        <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">No trusted contacts added</div>
          ) : (
            contacts.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                  </div>
                </div>
                <i className="fas fa-shield-check text-green-500 text-sm"></i>
              </div>
            ))
          )}
        </div>
      </section>

      {/* AI Preferences */}
      <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Caller ID Filtering</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Block known spam</span>
          <button 
            onClick={() => onToggle('blockSpam')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.blockSpam ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.blockSpam ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Screen unknown numbers</span>
          <button 
            onClick={() => onToggle('screenUnknown')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.screenUnknown ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.screenUnknown ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div className={`rounded-3xl p-6 border transition-all duration-500 ${settings.autoKill ? 'bg-red-600 border-red-700 text-white' : 'bg-red-50 border-red-100 text-red-600'}`}>
        <h3 className="font-bold mb-2">Advanced Protection</h3>
        <p className={`text-xs mb-4 ${settings.autoKill ? 'text-white/80' : 'text-red-500/80'}`}>
          Automatically terminate calls when AI detects high-risk fraud markers.
        </p>
        <button 
          onClick={() => onToggle('autoKill')}
          className={`w-full py-3 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
            settings.autoKill 
              ? 'bg-white text-red-600' 
              : 'bg-red-600 text-white'
          }`}
        >
          {settings.autoKill ? 'Disable AI Auto-Kill' : 'Enable AI Auto-Kill'}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
