
import React from 'react';
import { FlockData, User } from '../types';

interface SettingsProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Settings: React.FC<SettingsProps> = ({ flock, setFlock, user, setUser }) => {
  const handleReset = () => {
    if (window.confirm("Are you sure? This will delete all current batch data for " + flock.name + ".")) {
      setFlock({
        id: '1',
        name: 'New Batch',
        count: 100,
        arrivalDate: new Date().toISOString().split('T')[0],
        currentDay: 1,
        mortality: 0,
        feedType: 'Starter',
        weights: [{ day: 0, weight: 42 }],
        inventory: { feedBags: 5, bagSizeKg: 50 },
        completedTaskIds: [],
        healthAlerts: []
      });
      window.alert("Batch data reset successfully.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Do you want to sign out from " + user.farmName + "?")) {
      setUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      {/* Farmer Profile Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gray-900 h-16 w-16 rounded-3xl flex items-center justify-center text-white text-2xl font-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{user.name}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.farmName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
            <span className="font-bold text-gray-700">{user.location}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-4 border-2 border-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-50 transition active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            Logout Profile
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Batch Setup</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Batch Identification</label>
            <input 
              type="text" 
              value={flock.name} 
              onChange={e => setFlock({...flock, name: e.target.value})}
              className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-100 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Initial Count</label>
              <input 
                type="number" 
                value={flock.count} 
                onChange={e => setFlock({...flock, count: parseInt(e.target.value) || 0})}
                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Arrival Date</label>
              <input 
                type="date" 
                value={flock.arrivalDate} 
                onChange={e => setFlock({...flock, arrivalDate: e.target.value})}
                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-100 font-bold font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Feed Size (kg)</label>
              <input 
                type="number" 
                value={flock.inventory.bagSizeKg} 
                onChange={e => setFlock({...flock, inventory: {...flock.inventory, bagSizeKg: parseInt(e.target.value) || 50}})}
                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deaths Recorded</label>
              <input 
                type="number" 
                value={flock.mortality} 
                readOnly
                className="w-full bg-gray-100 p-4 rounded-2xl border border-gray-100 text-gray-400 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50">
          <h3 className="text-lg font-black text-red-600 mb-4 tracking-tight">Danger Zone</h3>
          <button 
            onClick={handleReset}
            className="w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            Reset Current Batch
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ChickMate AI v1.2.5 (Authenticated Session)</p>
      </div>
    </div>
  );
};

export default Settings;
