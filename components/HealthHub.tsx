
import React, { useState } from 'react';
import PoopDoctor from './PoopDoctor';
import CoopListener from './CoopListener';
import { FlockData } from '../types';

interface HealthHubProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
}

const HealthHub: React.FC<HealthHubProps> = ({ flock, setFlock }) => {
  const [activeTool, setActiveTool] = useState<'poop' | 'audio'>('poop');

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => setActiveTool('poop')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'poop' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          Poop Doctor
        </button>
        <button 
          onClick={() => setActiveTool('audio')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTool === 'audio' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          Coop Listener
        </button>
      </div>

      {activeTool === 'poop' ? (
        <PoopDoctor flock={flock} setFlock={setFlock} />
      ) : (
        <CoopListener flock={flock} setFlock={setFlock} />
      )}
    </div>
  );
};

export default HealthHub;
