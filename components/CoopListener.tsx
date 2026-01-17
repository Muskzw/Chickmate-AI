
import React, { useState, useRef, useEffect } from 'react';
import { audioAnalysis } from '../services/gemini';
import { FlockData, HealthAlert } from '../types';

interface CoopListenerProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
}

const CoopListener: React.FC<CoopListenerProps> = ({ flock, setFlock }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setResult(null);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleAudioProcess(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      intervalRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 60000);

    } catch (err) {
      alert("Microphone access denied or error occurred.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAudioProcess = async (blob: Blob) => {
    setLoading(true);
    try {
      const base64 = await blobToBase64(blob);
      const analysis = await audioAnalysis(base64);
      setResult(analysis);

      // Check for respiratory distress keywords
      const lowerAnalysis = analysis.toLowerCase();
      const riskKeywords = ['crd', 'snicking', 'gasping', 'respiratory', 'coughing', 'distress', 'critical'];
      const isHighRisk = riskKeywords.some(keyword => lowerAnalysis.includes(keyword));

      if (isHighRisk) {
        const newAlert: HealthAlert = {
          id: Date.now().toString(),
          type: 'audio',
          severity: 'high',
          message: 'AI detected respiratory distress sounds (snicking/gasping) in the coop. CRD risk is high.',
          timestamp: Date.now()
        };
        setFlock(prev => ({
          ...prev,
          healthAlerts: [newAlert, ...prev.healthAlerts].slice(0, 5)
        }));
      }
    } catch (err) {
      setResult("Error analyzing audio. Ensure the recording is clear.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Coop Listener 🎧</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">Place phone near birds for 60 seconds. AI detects early signs of respiratory disease like CRD before physical symptoms appear.</p>
        
        <div className="flex flex-col items-center justify-center py-10">
          <div className={`w-48 h-48 rounded-[3rem] flex items-center justify-center transition-all duration-500 relative ${isRecording ? 'bg-red-50 border-8 border-red-500 shadow-2xl shadow-red-100' : 'bg-gray-50 border-4 border-gray-100'}`}>
            {isRecording ? (
              <div className="flex flex-col items-center">
                <span className="text-red-500 font-black text-4xl tracking-tighter animate-pulse">{formatTime(timer)}</span>
                <span className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Monitoring</span>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm">
                <svg className="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path></svg>
              </div>
            )}
            
            {isRecording && (
              <div className="absolute -inset-4 border-4 border-red-500/20 rounded-[3.5rem] animate-ping duration-1000"></div>
            )}
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`mt-12 px-10 py-5 rounded-[2rem] font-black text-white shadow-xl transition-all duration-300 ${loading ? 'bg-gray-200 cursor-not-allowed' : isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700 active:scale-95'}`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 PROCESSING AUDIO...
              </span>
            ) : isRecording ? 'STOP & ANALYZE' : 'BEGIN ACOUSTIC SCAN'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Acoustic Health Report</h3>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Spectral Scan</span>
          </div>
          <div className="prose prose-orange max-w-none text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoopListener;
