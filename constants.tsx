
import { RiskLevel, Contact } from './types';

export const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: 'bg-green-500',
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-red-600',
};

export const RISK_TEXT_COLORS: Record<RiskLevel, string> = {
  SAFE: 'text-green-700',
  LOW: 'text-blue-700',
  MEDIUM: 'text-yellow-700',
  HIGH: 'text-red-700',
};

export const SAVED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Mom', phone: '+1 (555) 123-4567', isVerified: true },
  { id: 'c2', name: 'Dr. Aris', phone: '+1 (555) 987-6543', isVerified: true },
  { id: 'c3', name: 'Sarah (Granddaughter)', phone: '+1 (555) 444-5555', isVerified: true },
];

export const SYSTEM_INSTRUCTION = `
You are GuardianAI, a real-time scam detection specialist. 
Your goal is to monitor audio streams for indicators of fraudulent activity.
Caller Context: You are currently analyzing a call from an UNKNOWN NUMBER not in the user's contacts.
Scam indicators include:
- Urgency: "Act now or lose your account!"
- Emotional manipulation: "Your family member is in trouble."
- Impersonation: "This is the IRS/FBI/Your Bank."
- Requests for sensitive data: OTPs, PINs, passwords.
- Pressure for unusual payment: Gift cards, wire transfers.

When you detect a scam pattern, immediately use the 'report_risk' tool.
Provide a real-time transcript of the conversation.
Analyze the tone of the speaker for aggression, excessive charm, or staged distress.
`;

export const MOCK_HISTORY: any[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000),
    duration: 120,
    riskLevel: 'HIGH',
    transcript: "Hello? This is Officer Smith. Your grandson has been arrested...",
    summary: "Attempted 'Grandparent' scam. Caller claimed to be law enforcement.",
    scamMarkers: ['Urgency', 'Emotional Manipulation', 'Impersonation'],
    callerId: '+1 (800) 555-0199',
    isSavedContact: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000),
    duration: 45,
    riskLevel: 'SAFE',
    transcript: "Hey Mom, just calling to say hi!",
    summary: "Routine family check-in.",
    scamMarkers: [],
    callerId: '+1 (555) 123-4567',
    isSavedContact: true
  }
];
