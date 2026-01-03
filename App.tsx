
import React, { useState, useEffect } from 'react';
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
  const [contacts, setContacts] = useState<Contact[]>(SAVED_CONTACTS);
  const [blockedNumbers, setBlockedNumbers] = useState<string[]>([]);
  
  // Security Settings State
  const [settings, setSettings] = useState({
    blockSpam: true,
    screenUnknown: true,
    autoKill: true // Default to true as per user request
  });

  const simulateCall = (number = '+1 (888) 402-1293') => {
    if (blockedNumbers.includes(number)) {
      alert("Guardian blocked a call from a previously reported number.");
      return;
    }
    const matchedContact = contacts.find(c => c.phone === number);
    setIncomingCall({ number, contact: matchedContact });
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
      transcript: 'Call declined by user.',
      summary: 'Blocked unknown caller.',
      scamMarkers: ['Unknown Caller'],
      callerId: incomingCall?.number,
      isSavedContact: !!incomingCall?.contact
    };
    setHistory(prev => [log, ...prev]);
    setIncomingCall(null);
  };

  const handleEndCall = (log?: CallLog) => {
    setActiveCall(false);
    if (log) {
      // If autoKill happened or log shows HIGH risk, automatically block
      if (log.riskLevel === 'HIGH' && settings.autoKill) {
        if (log.callerId) setBlockedNumbers(prev => [...new Set([...prev, log.callerId!])]);
        log.isBlocked = true;
      }
      setHistory(prev => [log, ...prev]);
    }
  };

  const handleReportSpam = (id: string) => {
    setHistory(prev => prev.map(log => {
      if (log.id === id) {
        if (log.callerId) setBlockedNumbers(prevBlocked => [...new Set([...prevBlocked, log.callerId!])]);
        return { 
          ...log, 
          riskLevel: 'HIGH' as const, 
          summary: 'REPORTED BY USER',
          reportedAt: Date.now(),
          isBlocked: true
        };
      }
      return log;
    }));
  };

  const handleUnreportSpam = (id: string) => {
    setHistory(prev => prev.map(log => {
      if (log.id === id) {
        if (log.callerId) setBlockedNumbers(prevBlocked => prevBlocked.filter(n => n !== log.callerId));
        const { reportedAt, isBlocked, ...rest } = log;
        return { ...rest, riskLevel: 'MEDIUM' as const, summary: 'Report retracted by user.' };
      }
      return log;
    }));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all call logs?")) {
      setHistory([]);
    }
  };

  const handleAddContact = () => {
    const name = window.prompt("Enter contact name:");
    const phone = window.prompt("Enter phone number (e.g. +1...):");
    if (name && phone) {
      const newContact: Contact = { id: Date.now().toString(), name, phone, isVerified: true };
      setContacts(prev => [...prev, newContact]);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
    return <CallProtection onEndCall={handleEndCall} autoKillEnabled={settings.autoKill} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Header onSettingsClick={() => setCurrentTab('settings')} />
      
      <main className="flex-1 overflow-y-auto pb-24 pt-4 px-4">
        {currentTab === 'home' && (
          <Dashboard 
            history={history} 
            blockedCount={blockedNumbers.length}
            onStartProtection={() => simulateCall()}
            onSimulateSpam={() => simulateCall('+1 (800) 999-0000')}
          />
        )}
        {currentTab === 'history' && (
          <HistoryView 
            history={history} 
            onReportSpam={handleReportSpam}
            onUnreportSpam={handleUnreportSpam}
            onClearAll={handleClearHistory}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsView 
            contacts={contacts} 
            settings={settings}
            onToggle={toggleSetting}
            onAddContact={handleAddContact}
          />
        )}
      </main>

      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} onStartCall={() => simulateCall()} />
    </div>
  );
};

export default App;
