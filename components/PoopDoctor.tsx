
import React, { useState, useRef } from 'react';
import { analyzePoop, generateSpeech } from '../services/gemini';
import { FlockData, HealthAlert } from '../types';
import { playPCM } from '../utils/audio';

interface PoopDoctorProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
}

const PoopDoctor: React.FC<PoopDoctorProps> = ({ flock, setFlock }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSpeak = async () => {
    if (!result || speaking) return;
    setSpeaking(true);
    try {
      const audio = await generateSpeech(result);
      if (audio) await playPCM(audio);
    } catch (err) {
      console.error(err);
    } finally {
      setSpeaking(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const analysis = await analyzePoop(base64);
      setResult(analysis || "No analysis returned.");

      const lowerAnalysis = analysis.toLowerCase();
      const highRiskKeywords = ['urgent', 'coccidiosis', 'newcastle', 'danger', 'outbreak', 'isolation', 'critical'];
      const isHighRisk = highRiskKeywords.some(keyword => lowerAnalysis.includes(keyword));

      if (isHighRisk) {
        const newAlert: HealthAlert = {
          id: Date.now().toString(),
          type: 'poop',
          severity: 'high',
          message: 'AI Scan detected high-risk symptoms in droppings. Review report and isolate birds immediately.',
          timestamp: Date.now()
        };
        setFlock(prev => ({
          ...prev,
          healthAlerts: [newAlert, ...prev.healthAlerts].slice(0, 5)
        }));
      }
    } catch (err) {
      setResult("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Poop Doctor 🩺</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">Visual AI analyzes droppings to detect internal parasites or bacterial infections instantly.</p>
        
        <div className="flex flex-col items-center">
          {image ? (
            <div className="relative w-full aspect-square max-w-sm">
              <img src={image} alt="Chicken Poop" className="w-full h-full object-cover rounded-3xl shadow-xl border-8 border-white" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-2xl p-3 hover:bg-red-600 transition shadow-lg active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square max-w-sm border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
            >
              <div className="bg-white p-6 rounded-3xl shadow-sm group-hover:scale-110 transition duration-300">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
              </div>
              <span className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mt-6">Capture Sample</span>
            </button>
          )}
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className={`mt-8 w-full max-w-sm py-5 rounded-[2rem] font-black text-white shadow-xl transition-all duration-300 ${!image || loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 active:scale-95'}`}
          >
            {loading ? 'RUNNING SCAN...' : 'DIAGNOSE DROPPLINGS'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">AI Report</h3>
            <button 
              onClick={handleSpeak}
              disabled={speaking}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition ${speaking ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              Listen to Report
            </button>
          </div>
          <div className="prose prose-orange max-w-none text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoopDoctor;
