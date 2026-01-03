
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { CallLog, RiskLevel } from '../types';
import { SYSTEM_INSTRUCTION, RISK_COLORS, RISK_TEXT_COLORS } from '../constants';
import { encode, decode, createBlob, decodeAudioData } from '../utils/audioUtils';

interface CallProtectionProps {
  onEndCall: (log?: CallLog) => void;
}

const reportRiskFunctionDeclaration: FunctionDeclaration = {
  name: 'report_risk',
  parameters: {
    type: Type.OBJECT,
    description: 'Update the real-time risk assessment of the current conversation.',
    properties: {
      level: {
        type: Type.STRING,
        description: 'The detected risk level (SAFE, LOW, MEDIUM, HIGH)',
        enum: ['SAFE', 'LOW', 'MEDIUM', 'HIGH'],
      },
      reason: {
        type: Type.STRING,
        description: 'Brief explanation for the risk level assessment.',
      },
      markers: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Specific scam markers detected (e.g., Urgency, Impersonation).',
      }
    },
    required: ['level', 'reason'],
  },
};

const CallProtection: React.FC<CallProtectionProps> = ({ onEndCall }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [risk, setRisk] = useState<{level: RiskLevel, reason: string, markers: string[]}>({
    level: 'SAFE',
    reason: 'Guardian system active. Listening...',
    markers: []
  });
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef<{input: string, output: string}>({ input: '', output: '' });

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    startSession();
    return () => {
      clearInterval(timer);
      cleanup();
    };
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.inputTranscription) {
              transcriptionBufferRef.current.input += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              const fullIn = transcriptionBufferRef.current.input;
              if (fullIn.trim()) setTranscripts(prev => [...prev.slice(-10), `Speaker: ${fullIn}`]);
              transcriptionBufferRef.current.input = '';
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'report_risk') {
                  const args = fc.args as any;
                  setRisk({ level: args.level, reason: args.reason, markers: args.markers || [] });
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { status: 'acknowledged' } }
                  }));
                }
              }
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          tools: [{ functionDeclarations: [reportRiskFunctionDeclaration] }]
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const cleanup = () => {
    if (sessionRef.current) try { sessionRef.current.close(); } catch {}
    sourcesRef.current.forEach(s => s.stop());
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const handleEnd = () => {
    // FIX: Added missing 'isSavedContact' property to satisfy CallLog interface
    const finalLog: CallLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      duration: elapsedTime,
      riskLevel: risk.level,
      transcript: transcripts.join(' | '),
      summary: risk.reason,
      scamMarkers: risk.markers,
      isSavedContact: false
    };
    cleanup();
    onEndCall(finalLog);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-indigo-900 z-50 flex flex-col items-center justify-center p-8 text-white">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Connecting Guardian</h2>
        <p className="text-white/60 text-center">Encrypting channel and activating AI voice analysis...</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 transition-colors duration-1000 ${risk.level === 'HIGH' ? 'bg-red-900' : risk.level === 'MEDIUM' ? 'bg-orange-900' : 'bg-slate-900'}`}>
      <div className="flex flex-col h-full safe-area-inset-bottom">
        
        {/* Risk Header */}
        <div className="p-8 pt-16 text-center">
          <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 ${risk.level === 'HIGH' ? 'bg-white text-red-600' : 'bg-white/20 text-white'}`}>
            <i className="fas fa-shield-halved mr-2"></i> Real-time Analysis
          </div>
          <h1 className="text-white/60 text-lg font-medium mb-1">Active Call</h1>
          <p className="text-white text-3xl font-mono font-bold">{formatTime(elapsedTime)}</p>
        </div>

        {/* Dynamic Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative mb-12">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl text-white transition-all duration-500 shadow-2xl ${RISK_COLORS[risk.level]} ${risk.level === 'HIGH' ? 'animate-pulse scale-110' : ''}`}>
              <i className={`fas ${risk.level === 'HIGH' ? 'fa-triangle-exclamation' : 'fa-user-lock'}`}></i>
            </div>
            {risk.level === 'HIGH' && (
              <div className="absolute -top-2 -right-2 bg-white text-red-600 w-10 h-10 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <i className="fas fa-bell"></i>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-3xl w-full text-center transition-all duration-500 ${risk.level === 'HIGH' ? 'bg-white' : 'bg-white/10 backdrop-blur-md'}`}>
            <p className={`text-xl font-bold mb-2 ${risk.level === 'HIGH' ? 'text-red-600' : 'text-white'}`}>
              {risk.level === 'HIGH' ? 'DANGER DETECTED' : 'Safe to Converse'}
            </p>
            <p className={`text-sm leading-relaxed ${risk.level === 'HIGH' ? 'text-slate-800' : 'text-white/70'}`}>
              {risk.reason}
            </p>
          </div>
        </div>

        {/* Live Subtitles */}
        <div className="h-24 px-8 flex items-center justify-center text-center overflow-hidden mb-8">
           <p className="text-white/40 italic text-sm line-clamp-2">
             {transcripts.slice(-1)[0] || "Listening for speech patterns..."}
           </p>
        </div>

        {/* Call Controls */}
        <div className="p-8 grid grid-cols-1 gap-4">
          {risk.level === 'HIGH' && (
            <button 
              onClick={handleEnd}
              className="w-full bg-white text-red-600 py-6 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-transform"
            >
              <i className="fas fa-phone-slash"></i>
              <span>HANG UP NOW</span>
            </button>
          )}
          <button 
            onClick={handleEnd}
            className={`w-full py-6 rounded-2xl font-bold flex items-center justify-center space-x-3 active:scale-95 transition-transform ${risk.level === 'HIGH' ? 'bg-white/20 text-white' : 'bg-red-500 text-white shadow-xl'}`}
          >
            <i className="fas fa-phone-slash"></i>
            <span>{risk.level === 'HIGH' ? 'Safety Disconnect' : 'End Call'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallProtection;
