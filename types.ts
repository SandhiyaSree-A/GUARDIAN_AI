
export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  isVerified: boolean;
}

export interface CallLog {
  id: string;
  timestamp: Date;
  duration: number;
  riskLevel: RiskLevel;
  transcript: string;
  summary: string;
  scamMarkers: string[];
  callerId?: string;
  isSavedContact: boolean;
  reportedAt?: number; // Timestamp of report
  isBlocked?: boolean;
}

export interface LiveAnalysis {
  riskLevel: RiskLevel;
  confidence: number;
  reason: string;
  detectedEmotions: string[];
}
