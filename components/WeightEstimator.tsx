
import React, { useState, useRef } from 'react';
import { estimateWeight } from '../services/gemini';
import { FlockData } from '../types';

interface WeightEstimatorProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
}

const WeightEstimator: React.FC<WeightEstimatorProps> = ({ flock, setFlock }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const analysis = await estimateWeight(base64);
      setResult(analysis || "Analysis failed.");
    } catch (err) {
      setResult("Error estimating weight.");
    } finally {
      setLoading(false);
    }
  };

  const saveToRecord = () => {
    // Try to extract a number from the result text
    const weightMatch = result?.match(/(\d+)\s*g/);
    const weightVal = weightMatch ? parseInt(weightMatch[1]) : 0;
    
    const input = window.prompt("Confirm weight to record (in grams):", weightVal.toString());
    if (input) {
      const confirmedWeight = parseInt(input);
      if (!isNaN(confirmedWeight)) {
        setFlock(prev => {
          const newWeights = [...prev.weights];
          const existingDayIdx = newWeights.findIndex(w => w.day === prev.currentDay);
          if (existingDayIdx > -1) {
            newWeights[existingDayIdx] = { day: prev.currentDay, weight: confirmedWeight };
          } else {
            newWeights.push({ day: prev.currentDay, weight: confirmedWeight });
          }
          return { ...prev, weights: newWeights };
        });
        window.alert("Weight recorded in batch history! 🐥");
        setResult(null);
        setImage(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4 items-center">
        <span className="text-3xl">📏</span>
        <div>
          <h3 className="font-black text-amber-900 text-sm uppercase tracking-tight">Camera Weighing</h3>
          <p className="text-xs text-amber-700 leading-tight">No scale? No problem. Point your camera at a bird from 30cm away to estimate its weight.</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {image ? (
          <div className="relative w-full max-w-md aspect-[4/3]">
            <img src={image} alt="Bird Preview" className="w-full h-full object-cover rounded-[2.5rem] shadow-xl border-8 border-white" />
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-2xl p-3 shadow-lg active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-orange-200 transition-all duration-300 group"
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition duration-300">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
            </div>
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Capture Bird Stand</span>
          </button>
        )}
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className={`mt-6 w-full py-5 rounded-[2rem] font-black text-white shadow-xl transition-all active:scale-95 ${!image || loading ? 'bg-gray-200' : 'bg-gray-900 hover:bg-black'}`}
        >
          {loading ? 'ESTIMATING MASS...' : 'CALCULATE BIRD WEIGHT'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2 text-gray-800 font-black uppercase text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Result Ready
            </div>
            <button 
              onClick={saveToRecord}
              className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-green-700 active:scale-95"
            >
              Save to History
            </button>
          </div>
          <div className="whitespace-pre-wrap text-gray-700 text-sm leading-loose prose-orange">{result}</div>
        </div>
      )}
    </div>
  );
};

export default WeightEstimator;
