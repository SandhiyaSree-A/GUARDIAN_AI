
import React from 'react';
import { Contact } from '../types';

interface SettingsViewProps {
  contacts?: Contact[];
}

const SettingsView: React.FC<SettingsViewProps> = ({ contacts = [] }) => {
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
          <button className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {contacts.map(c => (
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
          ))}
        </div>
      </section>

      {/* AI Preferences */}
      <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Caller ID Filtering</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Block known spam</span>
          <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Screen unknown numbers</span>
          <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
        <h3 className="font-bold text-red-600 mb-2">Advanced Protection</h3>
        <p className="text-xs text-red-500/80 mb-4">Automatically terminate calls when AI detects high-risk fraud markers.</p>
        <button className="w-full bg-red-600 text-white py-3 rounded-2xl font-bold text-sm">Enable AI Auto-Kill</button>
      </div>
    </div>
  );
};

export default SettingsView;
