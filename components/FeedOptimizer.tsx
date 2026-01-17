
import React, { useState, useMemo } from 'react';
import { optimizeFeed } from '../services/gemini';
import { FlockData } from '../types';

interface FeedOptimizerProps {
  flock: FlockData;
  setFlock?: React.Dispatch<React.SetStateAction<FlockData>>;
}

const FeedOptimizer: React.FC<FeedOptimizerProps> = ({ flock, setFlock }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [params, setParams] = useState({
    day: flock.currentDay || 1,
    weight: flock.weights[flock.weights.length-1]?.weight || 450,
    temp: 28,
    humidity: 60,
    location: 'Nairobi, Kenya',
    birdCount: flock.count - flock.mortality,
    feedType: flock.feedType || 'Starter',
    feedCost: 1.25 // Default
  });

  const estimatedDailyNeed = useMemo(() => {
    let gramsPerBird = 50; 
    if (params.feedType === 'Grower') gramsPerBird = 130; 
    if (params.feedType === 'Finisher') gramsPerBird = 190; 
    if (params.temp > 32) gramsPerBird *= 0.85; 
    return (params.birdCount * gramsPerBird) / 1000;
  }, [params.feedType, params.birdCount, params.temp]);

  const currentStockKg = flock.inventory.feedBags * flock.inventory.bagSizeKg;
  const isDepletingNextCycle = currentStockKg < estimatedDailyNeed;

  const isTempHigh = params.temp > 35;
  const isHumidHigh = params.humidity > 80;

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const data = await optimizeFeed(params);
      setResult(data);
      if (setFlock) {
        setFlock(prev => ({ ...prev, feedType: params.feedType as any }));
      }
    } catch (err) {
      alert("Error optimizing feed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* WARNINGS */}
      {(isTempHigh || isHumidHigh || isDepletingNextCycle) && (
        <div className="bg-red-600 rounded-[2.5rem] p-6 text-white shadow-xl space-y-4 animate-pulse border-4 border-white/20">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h4 className="text-xl font-black uppercase tracking-tight">Critical Warning</h4>
          </div>
          <div className="text-sm font-bold opacity-90 leading-snug">
            {isTempHigh && <p>• EXTREME HEAT: {params.temp}°C. Birds will stop eating. Add electrolytes to water.</p>}
            {isHumidHigh && <p>• WET LITTER RISK: Humidity is {params.humidity}%. Coccidiosis risk is very high.</p>}
            {isDepletingNextCycle && <p>• FEED DEPLETION: You have {currentStockKg}kg left. You need {estimatedDailyNeed.toFixed(1)}kg for tomorrow.</p>}
          </div>
        </div>
      )}

      {/* Main Calculator Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-8">Feed Optimizer ⚖️</h2>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Feeding Phase</label>
                <select 
                  value={params.feedType}
                  onChange={e => setParams({...params, feedType: e.target.value})}
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-orange-100 focus:outline-none font-black text-gray-700 transition"
                >
                  <option value="Starter">Starter (Day 1-14)</option>
                  <option value="Grower">Grower (Day 15-35)</option>
                  <option value="Finisher">Finisher (Day 36+)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Feed Cost per Kg ($)</label>
                <input 
                  type="number" step="0.01"
                  value={params.feedCost} 
                  onChange={e => setParams({...params, feedCost: parseFloat(e.target.value) || 0})}
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-orange-100 focus:outline-none font-black text-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temperature</label>
                  <span className={`text-sm font-black ${params.temp > 30 ? 'text-orange-600' : 'text-blue-600'}`}>{params.temp}°C</span>
                </div>
                <input 
                  type="range" min="15" max="42" 
                  value={params.temp} 
                  onChange={e => setParams({...params, temp: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            <div className="space-y-6">
               <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Average Weight (g)</label>
                <input 
                  type="number" 
                  value={params.weight} 
                  onChange={e => setParams({...params, weight: parseInt(e.target.value) || 0})}
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-orange-100 focus:outline-none font-black text-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Humidity (%)</label>
                  <span className="text-sm font-black text-green-600">{params.humidity}%</span>
                </div>
                <input 
                  type="range" min="30" max="95" 
                  value={params.humidity} 
                  onChange={e => setParams({...params, humidity: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Farm Location</label>
                <input 
                  type="text" 
                  value={params.location} 
                  onChange={e => setParams({...params, location: e.target.value})}
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-orange-100 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading}
            className={`w-full py-6 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${loading ? 'bg-gray-200' : 'bg-gray-900 hover:bg-black'}`}
          >
            {loading ? 'CALCULATING PROFIT...' : 'GET AI FEEDING STRATEGY'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h3 className="text-xl font-black text-gray-800">Nutritional Strategy</h3>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">AI Analyzed</span>
          </div>
          <div className="prose prose-orange max-w-none text-gray-700 whitespace-pre-wrap text-sm leading-loose">
            {result.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedOptimizer;
