
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    farmName: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.farmName) {
      onLogin({
        ...formData,
        isLoggedIn: true
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg glass dark:glass rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex bg-orange-600 p-5 rounded-3xl shadow-2xl shadow-orange-500/30 mb-6 transform hover:scale-110 transition duration-500">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 00-1.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"></path></svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">ChickMate <span className="text-orange-600">AI</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-3 uppercase tracking-[0.2em]">Next-Gen Poultry Ecosystem</p>
        </div>

        {/* Modern Apps Feature Showcase */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Veterinary AI', icon: '🩺' },
            { label: 'Market Hub', icon: '🛒' },
            { label: 'Growth Lab', icon: '⚖️' }
          ].map(app => (
            <div key={app.label} className="bg-white/50 dark:bg-white/5 p-3 rounded-2xl border border-white/20 text-center backdrop-blur-sm">
              <div className="text-xl mb-1">{app.icon}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{app.label}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Full Identity</label>
            <input 
              required
              type="text" 
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 rounded-[2rem] focus:ring-4 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500 transition-all font-bold text-lg backdrop-blur-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Farm Operation</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Skyline Broilers"
              value={formData.farmName}
              onChange={e => setFormData({...formData, farmName: e.target.value})}
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 rounded-[2rem] focus:ring-4 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500 transition-all font-bold text-lg backdrop-blur-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Operational Region</label>
            <input 
              required
              type="text" 
              placeholder="Location"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 rounded-[2rem] focus:ring-4 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500 transition-all font-bold text-lg backdrop-blur-md"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition duration-300 transform"
          >
            ENTER THE ECOSYSTEM
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
          Secured by AI Biosecurity Protocols
        </p>
      </div>
    </div>
  );
};

export default Login;