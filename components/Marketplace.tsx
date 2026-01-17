
import React, { useState } from 'react';
import { MarketListing, User, FlockData } from '../types';

interface MarketplaceProps {
  user: User;
  flock: FlockData;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user, flock }) => {
  const [ownListing, setOwnListing] = useState<MarketListing | null>(null);

  const [peerListings] = useState<MarketListing[]>([
    { id: '1', farmerName: 'Green Meadows Farm', birdCount: 150, weightAverage: 2.4, location: 'Central Region', pricePerKg: 12.5 },
    { id: '2', farmerName: 'Sun Valley Poultry', birdCount: 300, weightAverage: 2.1, location: 'East Sector', pricePerKg: 11.8 },
    { id: '3', farmerName: 'Happy Hens Ltd', birdCount: 80, weightAverage: 2.6, location: 'North Ridge', pricePerKg: 13.2 },
  ]);

  const handlePostListing = () => {
    const avgWeight = flock.weights.length > 0 
      ? flock.weights[flock.weights.length - 1].weight / 1000 
      : 0;
      
    const newListing: MarketListing = {
      id: 'own-' + Date.now(),
      farmerName: user.farmName,
      birdCount: flock.count - flock.mortality,
      weightAverage: avgWeight,
      location: user.location,
      pricePerKg: 12.0,
      isOwnListing: true
    };
    
    setOwnListing(newListing);
    window.alert("Your batch from " + user.farmName + " is now LIVE! 🚀");
  };

  const handleGenerateAd = (listing: MarketListing) => {
    const adText = `🐥 *ChickMate Market Alert!*\n\nHigh-Quality Broilers from *${listing.farmerName}*!\n- *Avg Weight:* ${listing.weightAverage.toFixed(2)}kg\n- *Qty:* ${listing.birdCount} birds\n- *Location:* ${listing.location}\n- *Verified Health Report included.*\n\nDirect orders welcome! Message me now.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(adText)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Marketplace</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{user.location} Trading Hub</p>
        </div>
        {!ownListing && (
          <button 
            onClick={handlePostListing}
            className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition hover:bg-orange-700"
          >
            Post My Batch
          </button>
        )}
      </div>

      {/* Own Active Listing */}
      {ownListing && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1 rounded-[3rem] shadow-2xl shadow-orange-600/20">
          <div className="glass dark:glass p-8 rounded-[2.8rem]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Active Listing</span>
                <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{ownListing.farmerName}</h4>
              </div>
              <button onClick={() => setOwnListing(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-white/20">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                <p className="text-2xl font-black dark:text-white">{ownListing.birdCount} <span className="text-xs">Birds</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-white/20">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Mass</p>
                <p className="text-2xl font-black dark:text-white">{ownListing.weightAverage.toFixed(2)} <span className="text-xs">Kg</span></p>
              </div>
            </div>

            <button 
              onClick={() => handleGenerateAd(ownListing)}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-3"
            >
              Share Professional Ad
            </button>
          </div>
        </div>
      )}

      {/* Regional Peer Listings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2 mb-2">
           <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Nearby Farmers</h3>
        </div>
        
        {peerListings.map(item => (
          <div key={item.id} className="glass dark:glass p-7 rounded-[3rem] shadow-lg border border-white/20 dark:border-slate-800/50 hover:border-orange-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-black text-xl text-slate-800 dark:text-white tracking-tight group-hover:text-orange-600 transition">{item.farmerName}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                   <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</span>
                </div>
              </div>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-green-200 dark:border-green-800">Verified Health</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-white/10">
              <div className="text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Batch Size</p>
                 <p className="text-xl font-black dark:text-white">{item.birdCount}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Avg Weight</p>
                 <p className="text-xl font-black dark:text-white">{item.weightAverage}kg</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Asking Price</p>
                 <p className="text-xl font-black text-orange-600">${item.pricePerKg}</p>
              </div>
            </div>

            <button className="w-full mt-4 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-slate-700 transition active:scale-95">
               Contact Farmer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;