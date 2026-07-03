import React from 'react';
import { motion } from 'framer-motion';
import { useUniverse } from '@/lib/UniverseContext';
import { Label } from '@/components/aether/Typography';
import { Glass } from '@/components/aether/Glass';
import { Database, Link2, Share2, Search, Filter } from 'lucide-react';

export const DatabaseMatrix: React.FC = () => {
  // Mock data for artifacts
  const artifacts = [
    { id: '1', title: 'Neural Fragment 09', type: 'Logic', color: 'bg-blue-500' },
    { id: '2', title: 'Crystal Echo', type: 'Audio', color: 'bg-rose-500' },
    { id: '3', title: 'Vector Soul', type: 'Design', color: 'bg-emerald-500' },
    { id: '4', title: 'Void Script', type: 'Code', color: 'bg-purple-500' },
    { id: '5', title: 'Prism Memory', type: 'Visual', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <Database className="text-[var(--theme-primary)] w-4 h-4" />
           <Label className="text-white/40 uppercase tracking-[0.2em] font-black text-[10px]">Knowledge Matrix</Label>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
            <Search size={12} />
          </button>
          <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
            <Filter size={12} />
          </button>
        </div>
      </div>

      <Glass className="p-6 border-white/5 min-h-[400px] flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art, i) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-2 h-2 rounded-full ${art.color} shadow-[0_0_8px_currentColor]`} />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link2 size={10} className="text-white/40 hover:text-white" />
                  <Share2 size={10} className="text-white/40 hover:text-white" />
                </div>
              </div>
              <div className="text-xs font-black text-white mb-1">{art.title}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-white/20">{art.type}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Neural Relationship Graph</div>
           <div className="relative w-full h-32 flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--theme-primary)_0%,transparent_70%)] opacity-10" />
             <div className="flex items-center gap-1 justify-center">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [10, 30, 15, 40, 20],
                      opacity: [0.1, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 2 + (i % 5) * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-[var(--theme-primary)] rounded-full"
                  />
                ))}
             </div>
           </div>
        </div>
      </Glass>
    </div>
  );
};
