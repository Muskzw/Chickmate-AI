
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlockData, Task, User } from '../types';
import { generateSpeech } from '../services/gemini';
import { playPCM } from '../utils/audio';

interface DashboardProps {
  flock: FlockData;
  setFlock: React.Dispatch<React.SetStateAction<FlockData>>;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ flock, setFlock, user }) => {
  const [speaking, setSpeaking] = useState(false);

  const tasks: Task[] = [
    { id: '1', day: 1, title: 'Check Brooder Temp', description: 'Ensure heat is 33°C for new arrivals.' },
    { id: '2', day: flock.currentDay, title: 'Clean Waterers', description: 'Bio-security starts with clean water.' },
    { id: '3', day: 7, title: 'Newcastle Vaccine', description: 'Administer 1st dose via drinking water.' },
    { id: '4', day: 14, title: 'Switch to Grower', description: 'Transition feed over 3 days.' },
  ];

  const dailyTip = useMemo(() => {
    if (flock.currentDay <= 7) return "Keep the litter dry! Damp sawdust breeds Coccidiosis. Stir it daily.";
    if (flock.currentDay <= 21) return "Birds need more space now. Ensure feeders are spread out to prevent bullying.";
    return "Check for snicking sounds at night. Early detection of CRD saves the batch.";
  }, [flock.currentDay]);

  const handleSpeakTip = async () => {
    if (speaking) return;
    setSpeaking(true);
    try {
      const audioBase64 = await generateSpeech(dailyTip);
      if (audioBase64) {
        await playPCM(audioBase64);
      }
    } catch (err) {
      console.error("Speech error", err);
    } finally {
      setSpeaking(false);
    }
  };

  const chartData = useMemo(() => {
    const baseData = Array.from({ length: Math.max(flock.currentDay, 7) }, (_, i) => {
      const day = i + 1;
      const actual = flock.weights.find(w => w.day === day)?.weight;
      return {
        day,
        weight: actual || Math.round(42 * Math.pow(1.15, i)),
        standard: Math.round(42 * Math.pow(1.18, i))
      };
    });
    return baseData;
  }, [flock.currentDay, flock.weights]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Personalized Welcome */}
      <div className="flex flex-col mb-4">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Hi, {user.name.split(' ')[0]} 👋</h2>
        <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">{user.farmName} • {user.location}</p>
      </div>

      {/* Main Stats: Dual Column */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass dark:glass p-6 rounded-[2.5rem] shadow-xl border border-white/30 dark:border-slate-800/50 flex flex-col justify-between h-44">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Stock</span>
          <div>
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{flock.count - flock.mortality}</span>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Live Birds</p>
          </div>
        </div>

        <div className="glass dark:glass p-6 rounded-[2.5rem] shadow-xl border border-white/30 dark:border-slate-800/50 flex flex-col justify-between h-44">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Batch Day</span>
          <div>
            <span className="text-5xl font-black text-orange-600 tracking-tighter">{flock.currentDay}</span>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
               <div className="bg-orange-500 h-full rounded-full" style={{ width: `${(flock.currentDay/42)*100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Wisdom Glass Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Daily Insight</h4>
             </div>
             <button onClick={handleSpeakTip} className={`p-2 bg-white/20 rounded-full backdrop-blur-md ${speaking ? 'animate-pulse' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
             </button>
          </div>
          <p className="font-bold text-xl leading-snug">{dailyTip}</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </div>

      {/* Growth Chart Glass Card */}
      <div className="glass dark:glass p-8 rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-800/50">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight dark:text-white">Growth Lab 📊</h3>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Weight performance vs Standard</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Potential Value</span>
             <p className="text-2xl font-black tracking-tighter dark:text-white">${((flock.count - flock.mortality) * (chartData[chartData.length-1].weight / 1000) * 1.5).toFixed(0)}</p>
          </div>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.1} />
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', background: 'rgba(255,255,255,0.9)' }} 
                itemStyle={{ fontWeight: '800', color: '#ea580c' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#ea580c" strokeWidth={5} fillOpacity={1} fill="url(#colorWeight)" />
              <Area type="monotone" dataKey="standard" stroke="#94a3b8" strokeWidth={2} strokeDasharray="8 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks Glass List */}
      <div className="glass dark:glass p-8 rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-800/50">
        <h3 className="text-xl font-black tracking-tight mb-8 dark:text-white">Batch Guide ✅</h3>
        <div className="space-y-3">
          {tasks.filter(t => t.day <= flock.currentDay).map(task => {
            const isCompleted = flock.completedTaskIds.includes(task.id);
            return (
              <div 
                key={task.id} 
                className={`p-5 rounded-[2rem] border transition-all duration-300 flex items-center gap-5 ${isCompleted ? 'bg-slate-50/50 dark:bg-slate-900/50 border-transparent opacity-60' : 'bg-white/50 dark:bg-slate-800/50 border-white/20 shadow-sm'}`}
              >
                <div className={`w-10 h-10 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center ${isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-200 dark:border-slate-700'}`}>
                  {isCompleted && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
                <div>
                   <h4 className={`text-sm font-black uppercase tracking-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{task.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;