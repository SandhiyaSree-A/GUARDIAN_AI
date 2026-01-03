
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import CallProtection from './components/CallProtection';
import BottomNav from './components/BottomNav';
import IncomingCallScreen from './components/IncomingCallScreen';
import { CallLog, Contact } from './types';
import { MOCK_HISTORY, SAVED_CONTACTS } from './constants';

const App: React.FC = () => {
  const [activeCall, setActiveCall] = useState<boolean>(false);
  const [incomingCall, setIncomingCall] = useState<{ number: string; contact?: Contact } | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'history' | 'settings'>('home');
  const [history, setHistory] = useState<CallLog[]>(MOCK_HISTORY);

  // Simulation: Trigger an unknown call
  const simulateUnknownCall = () => {
    setIncomingCall({ number: '+1 (888) 402-1293' });
  };

  const handleAcceptCall = () => {
    setIncomingCall(null);
    setActiveCall(true);
  };

  const handleDeclineCall = () => {
    const log: CallLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      duration: 0,
      riskLevel: 'MEDIUM',
      transcript: 'Call declined by user during AI pre-screening.',
      summary: 'Blocked unknown caller based on AI risk warning.',
      scamMarkers: ['Unknown Caller'],
      callerId: incomingCall?.number,
      isSavedContact: false
    };
    setHistory(prev => [log, ...prev]);
    setIncomingCall(null);
  };

  const handleEndCall = (log?: CallLog) => {
    setActiveCall(false);
    if (log) {
      setHistory(prev => [log, ...prev]);
    }
  };

  const handleReportSpam = (id: string) => {
    setHistory(prev => prev.map(log => 
      log.id === id ? { ...log, riskLevel: 'HIGH' as const, summary: 'REPORTED BY USER' } : log
    ));
  };

  if (incomingCall) {
    return (
      <IncomingCallScreen 
        number={incomingCall.number} 
        contact={incomingCall.contact} 
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    );
  }

  if (activeCall) {
    return <CallProtection onEndCall={handleEndCall} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24 pt-4 px-4">
        {currentTab === 'home' && (
          <Dashboard 
            history={history} 
            onStartProtection={simulateUnknownCall}
          />
        )}
        {currentTab === 'history' && (
          <HistoryView 
            history={history} 
            onReportSpam={handleReportSpam}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsView contacts={SAVED_CONTACTS} />
        )}
      </main>

      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} onStartCall={simulateUnknownCall} />
    </div>
  );
};

export default App;
