
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import HealthHub from './components/HealthHub';
import GrowthHub from './components/GrowthHub';
import Marketplace from './components/Marketplace';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Login from './components/Login';
import { FlockData, User } from './types';

enum Tab {
  Dashboard = 'dashboard',
  Health = 'health',
  Growth = 'growth',
  Assistant = 'assistant',
  Market = 'market',
  Settings = 'settings'
}

const STORAGE_KEY = 'chickmate_flock_data';
const USER_KEY = 'chickmate_user_profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [flock, setFlock] = useState<FlockData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      id: '1',
      name: 'Batch Alpha',
      count: 100,
      arrivalDate: new Date().toISOString().split('T')[0],
      currentDay: 1,
      mortality: 0,
      feedType: 'Starter',
      weights: [{ day: 0, weight: 42 }],
      inventory: {
        feedBags: 5,
        bagSizeKg: 50
      },
      completedTaskIds: ['1'],
      healthAlerts: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flock));
  }, [flock]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  if (!user || !user.isLoggedIn) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard: 
        return <Dashboard flock={flock} setFlock={setFlock} user={user} />;
      case Tab.Health: 
        return <HealthHub flock={flock} setFlock={setFlock} />;
      case Tab.Growth: 
        return <GrowthHub flock={flock} setFlock={setFlock} />;
      case Tab.Assistant: 
        return <AIAssistant />;
      case Tab.Market: 
        return <Marketplace user={user} flock={flock} />;
      case Tab.Settings:
        return <Settings flock={flock} setFlock={setFlock} user={user} setUser={setUser} />;
      default: 
        return <Dashboard flock={flock} setFlock={setFlock} user={user} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 dark:text-slate-100">
      <header className="glass dark:glass sticky top-0 z-50 px-4 h-20 border-b border-white/20 flex items-center justify-center">
        <div className="max-w-md w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2.5 rounded-2xl shadow-lg shadow-orange-600/20">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 00-1.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">ChickMate <span className="text-orange-600 italic">AI</span></h1>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Global Hub</p>
            </div>
          </div>
          <button onClick={() => setActiveTab(Tab.Settings)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-orange-600 transition duration-300 active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="max-w-md mx-auto glass dark:glass rounded-[2.5rem] shadow-2xl border border-white/20 p-2 flex justify-around items-center h-20">
          <NavButton 
            active={activeTab === Tab.Dashboard} 
            onClick={() => setActiveTab(Tab.Dashboard)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>}
            label="Home"
          />
          <NavButton 
            active={activeTab === Tab.Health} 
            onClick={() => setActiveTab(Tab.Health)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>}
            label="Health"
          />
          <NavButton 
            active={activeTab === Tab.Growth} 
            onClick={() => setActiveTab(Tab.Growth)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V2a1 1 0 112 0v5a1 1 0 01-1 1h-6zM10 13a1 1 0 110-2h5v-5a1 1 0 112 0v5a1 1 0 01-1 1h-6zM8 19a1 1 0 110-2h5v-5a1 1 0 112 0v5a1 1 0 01-1 1H8z" clipRule="evenodd"></path></svg>}
            label="Growth"
          />
          <NavButton 
            active={activeTab === Tab.Assistant} 
            onClick={() => setActiveTab(Tab.Assistant)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path></svg>}
            label="AI Chat"
          />
          <NavButton 
            active={activeTab === Tab.Market} 
            onClick={() => setActiveTab(Tab.Market)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>}
            label="Market"
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 relative ${active ? 'text-orange-600 scale-110' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
  >
    <div className="mb-1">{icon}</div>
    <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    {active && (
      <div className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-600 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
    )}
  </button>
);

export default App;