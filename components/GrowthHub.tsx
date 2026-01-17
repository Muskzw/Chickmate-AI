
import React, { useState } from 'react';
import FeedOptimizer from './FeedOptimizer';
import WeightEstimator from './WeightEstimator';
import { FlockData } from '../types';

interface GrowthHubProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
}

const GrowthHub: React.FC<GrowthHubProps> = ({ flock, setFlock }) => {
  const [activeTool, setActiveTool] = useState<'weight' | 'feed'>('weight');

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => setActiveTool('weight')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'weight' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          Weight Camera
        </button>
        <button 
          onClick={() => setActiveTool('feed')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'feed' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          Feed Optimizer
        </button>
      </div>

      {activeTool === 'weight' ? (
        <WeightEstimator flock={flock} setFlock={setFlock} />
      ) : (
        <FeedOptimizer flock={flock} setFlock={setFlock} />
      )}
    </div>
  );
};

export default GrowthHub;
