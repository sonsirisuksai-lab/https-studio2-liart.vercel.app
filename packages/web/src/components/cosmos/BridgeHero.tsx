import React from 'react';
import { motion } from 'framer-motion';
import { useRobin } from '@/lib/RobinContext';
import { useUniverse } from '@/lib/UniverseContext';
import { useRealm } from '@/lib/RealmContext';
import { Heading, Label } from '@/components/aether/Typography';
import { Glass } from '@/components/aether/Glass';
import { Sparkles, Terminal } from 'lucide-react';

export const BridgeHero: React.FC = () => {
  const { message } = useRobin();
  const { missions, energy } = useUniverse();
  const { realm } = useRealm();

  const activeMission = missions.find(m => m.status === 'active');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--theme-primary)] rounded-full animate-pulse" />
          <Heading size="48" className="font-black text-white tracking-tighter">
            Welcome Aboard, <span className="text-[var(--theme-primary)]">Captain</span>
          </Heading>
        </div>

        <Glass className="p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Terminal size={120} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)]/20 flex items-center justify-center text-[var(--theme-primary)]">
                <Sparkles size={24} />
              </div>
              <div>
                <Label className="text-[var(--theme-primary)] uppercase tracking-[0.3em] font-black text-[10px]">Robin Vanguard Report</Label>
                <motion.p 
                  key={message || 'default'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-white/90 mt-1 leading-relaxed"
                >
                  "{message || `ฉันกำลังมอนิเตอร์มิติ ${realm.name} ให้คุณอยู่ครับ บอส`}"
                </motion.p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active Mission</span>
                  <span className="text-[10px] font-mono text-[var(--theme-primary)] font-bold">{activeMission?.progress || 0}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${activeMission?.progress || 0}%` }}
                    className="h-full bg-[var(--theme-primary)]" 
                  />
                </div>
                <p className="text-xs font-bold text-white/60">{activeMission?.title || 'No active missions'}</p>
              </div>
              <div className="w-px h-12 bg-white/5" />
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest block">System Resonance</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${energy > 20 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-lg font-black text-white font-mono">{energy}%</span>
                </div>
              </div>
            </div>
          </div>
        </Glass>
      </div>

      <div className="space-y-6">
        <Label className="px-2 text-white/40 uppercase tracking-[0.2em] font-black text-[10px]">Dimensional Context</Label>
        <Glass className="p-6 aspect-square flex flex-col justify-between border-white/5">
          <div className="flex justify-between items-start">
             <div className="p-3 rounded-2xl bg-white/5 text-[var(--theme-primary)] text-2xl flex items-center justify-center">
               {realm.robin.icon}
             </div>
             <div className="text-right">
               <div className="text-xs font-black text-white">{realm.name}</div>
               <div className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">{realm.id}</div>
             </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs text-white/60 leading-relaxed italic">"{realm.description}"</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[8px] font-black text-white/20 uppercase">Atmosphere</div>
                <div className="text-[10px] font-bold text-white/80">{realm.robin.personality}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[8px] font-black text-white/20 uppercase">Core Logic</div>
                <div className="text-[10px] font-bold text-white/80">Neural Grid</div>
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};
