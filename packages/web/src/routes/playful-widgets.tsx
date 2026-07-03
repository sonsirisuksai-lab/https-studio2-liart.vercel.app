import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Calendar, Activity, Play } from 'lucide-react';

export default function PlayfulWidgets() {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans p-6 overflow-hidden relative"
    >
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Good Space</h1>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Plus className="w-5 h-5 text-slate-400" />
        </div>
      </header>

      {/* Widgets Container */}
      <div className="h-[80vh] relative">

        {/* Favorites Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          whileDrag={{ scale: 1.05, zIndex: 50 }}
          className="absolute top-10 left-4 w-48 bg-white/80 backdrop-blur-xl rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2 mb-4 text-pink-500 font-semibold">
            <Heart className="w-5 h-5 fill-pink-500" />
            Favorites
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                 <img src={`https://i.pravatar.cc/150?img=${i+40}`} alt="Fav" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Meeting Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          whileDrag={{ scale: 1.05, zIndex: 50 }}
          className="absolute top-48 right-4 w-56 bg-[#E8FF8C] rounded-[32px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-grab active:cursor-grabbing"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#E8FF8C]" />
            </div>
            <span className="font-bold">10:00 AM</span>
          </div>
          <h3 className="text-xl font-bold leading-tight mb-2">Team Sync<br/>Design</h3>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border-2 border-[#E8FF8C]">
                 <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="Team" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Abstract 3D Stone/Nature Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          whileDrag={{ scale: 1.05, zIndex: 50 }}
          className="absolute bottom-40 left-10 w-40 h-48 bg-white/60 backdrop-blur-md rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white cursor-grab active:cursor-grabbing overflow-hidden flex flex-col items-center justify-center"
        >
           {/* Abstract Stone Shapes */}
           <div className="relative w-full h-full flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-gradient-to-tr from-stone-400 to-stone-200 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-inner drop-shadow-xl absolute" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-bl from-slate-300 to-slate-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] shadow-inner drop-shadow-md absolute -top-4 -right-2" 
              />
           </div>
        </motion.div>

        {/* Flower / Audio Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          whileDrag={{ scale: 1.05, zIndex: 50 }}
          className="absolute top-10 right-10 w-32 h-32 bg-[#FFD1FA] rounded-full shadow-[0_10px_30px_rgba(255,209,250,0.5)] cursor-grab active:cursor-grabbing flex items-center justify-center group"
        >
          {/* Flower Petals */}
          <div className="absolute inset-0 flex items-center justify-center">
             {[0, 45, 90, 135].map(deg => (
                <div key={deg} className="absolute w-24 h-8 bg-white/30 rounded-full" style={{ transform: `rotate(${deg}deg)` }} />
             ))}
          </div>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center z-10 shadow-sm text-pink-500 hover:scale-110 transition-transform">
             <Play className="w-5 h-5 ml-1" />
          </button>
        </motion.div>

        {/* Activity Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          whileDrag={{ scale: 1.05, zIndex: 50 }}
          className="absolute bottom-20 right-8 w-60 bg-black text-white rounded-[32px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] cursor-grab active:cursor-grabbing"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
               </div>
               <span className="font-semibold">Morning Run</span>
            </div>
            <span className="text-gray-400 text-sm">Today</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
             <span className="text-4xl font-bold tracking-tighter">5.2</span>
             <span className="text-gray-400 mb-1">km</span>
          </div>
          
          {/* Minimal graph */}
          <div className="h-10 w-full flex items-end gap-1 mt-4">
             {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm" style={{ height: `${h}%` }}>
                   {i === 5 && <div className="w-full h-full bg-indigo-500 rounded-t-sm" />}
                </div>
             ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
