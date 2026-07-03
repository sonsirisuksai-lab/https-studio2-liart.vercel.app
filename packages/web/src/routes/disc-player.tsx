import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Menu, X } from 'lucide-react';

const DISCS = [
  { id: 1, title: 'Midnight', artist: 'Synthwave', color: 'bg-indigo-600', gradient: 'from-indigo-500 to-purple-600' },
  { id: 2, title: 'Ocean Drive', artist: 'Chillhop', color: 'bg-teal-500', gradient: 'from-teal-400 to-emerald-500' },
  { id: 3, title: 'Starlight', artist: 'Ambient', color: 'bg-rose-500', gradient: 'from-rose-400 to-orange-500' },
  { id: 4, title: 'Neon City', artist: 'Cyberpunk', color: 'bg-cyan-500', gradient: 'from-cyan-400 to-blue-600' },
  { id: 5, title: 'Acoustic', artist: 'Folk', color: 'bg-amber-600', gradient: 'from-amber-500 to-red-600' },
  { id: 6, title: 'Deep Space', artist: 'Electronic', color: 'bg-slate-800', gradient: 'from-slate-700 to-black' },
];

export default function DiscPlayer() {
  const [activeDisc, setActiveDisc] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans p-6 overflow-hidden relative">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-xl font-medium tracking-tight">Welcome to <span className="font-bold">[untitled]</span></h1>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="mb-8">
        <h2 className="text-4xl font-semibold tracking-tighter">Choose a disc</h2>
      </div>

      {/* Grid of Discs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 relative z-10">
        {DISCS.map((disc) => (
          <motion.button
            key={disc.id}
            layoutId={`disc-container-${disc.id}`}
            onClick={() => setActiveDisc(disc.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center group"
          >
            <motion.div 
              layoutId={`disc-visual-${disc.id}`}
              className={`w-full aspect-square rounded-full bg-gradient-to-br ${disc.gradient} shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative flex items-center justify-center mb-4 overflow-hidden border-4 border-white/40`}
            >
              {/* CD Inner Ring */}
              <div className="w-1/4 h-1/4 rounded-full bg-[#F5F5F7] border border-black/10 shadow-inner flex items-center justify-center z-20">
                 <div className="w-1/2 h-1/2 rounded-full bg-white shadow-inner" />
              </div>
              
              {/* CD Reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 transform -rotate-45 group-hover:rotate-45 transition-transform duration-1000 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg,transparent,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
            </motion.div>
            <h3 className="font-semibold text-lg">{disc.title}</h3>
            <p className="text-slate-500 text-sm">{disc.artist}</p>
          </motion.button>
        ))}
      </div>

      {/* Player Modal */}
      <AnimatePresence>
        {activeDisc !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
          >
            <motion.div 
              layoutId={`disc-container-${activeDisc}`}
              className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center"
            >
              <button 
                onClick={() => { setActiveDisc(null); setIsPlaying(false); }}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 z-50"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const disc = DISCS.find(d => d.id === activeDisc);
                if (!disc) return null;
                
                return (
                  <>
                    <motion.div 
                      layoutId={`disc-visual-${disc.id}`}
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className={`w-64 h-64 rounded-full bg-gradient-to-br ${disc.gradient} shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative flex items-center justify-center mb-10 overflow-hidden border-8 border-white/40 mt-10`}
                    >
                      <div className="w-16 h-16 rounded-full bg-white border border-black/10 shadow-inner flex items-center justify-center z-20">
                         <div className="w-8 h-8 rounded-full bg-slate-200 shadow-inner" />
                      </div>
                      <div className="absolute inset-0 bg-[conic-gradient(from_90deg,transparent,rgba(255,255,255,0.3),transparent)] pointer-events-none" />
                      
                      {/* Grooves */}
                      <div className="absolute inset-2 rounded-full border border-black/5" />
                      <div className="absolute inset-6 rounded-full border border-black/5" />
                      <div className="absolute inset-10 rounded-full border border-black/5" />
                    </motion.div>

                    <div className="text-center mb-10 w-full relative z-10">
                      <h2 className="text-3xl font-bold mb-1 tracking-tight">{disc.title}</h2>
                      <p className="text-slate-500 font-medium">{disc.artist}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-8 w-full relative z-10">
                      <button className="text-slate-400 hover:text-slate-800 transition-colors">
                        <SkipBack className="w-8 h-8 fill-current" />
                      </button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-2" />}
                      </button>
                      <button className="text-slate-400 hover:text-slate-800 transition-colors">
                        <SkipForward className="w-8 h-8 fill-current" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
