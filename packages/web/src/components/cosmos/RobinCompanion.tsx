import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { useRobin } from '@/lib/RobinContext';
import { useUniverse } from '@/lib/UniverseContext';
import { Brain, MessageSquare, ShieldAlert } from 'lucide-react';

export const RobinCompanion = () => {
  const { realm } = useRealm();
  const { action, emotion, message } = useRobin();
  const { energy, universeState, isUniverseStable } = useUniverse();

  // Particle positions for linter purity
  const particles = [
    { id: 0, x: -25, y: 32, delay: 0 },
    { id: 1, x: 18, y: -41, delay: 0.2 },
    { id: 2, x: 35, y: 12, delay: 0.4 },
    { id: 3, x: -12, y: -28, delay: 0.6 },
    { id: 4, x: 42, y: -15, delay: 0.8 },
    { id: 5, x: -38, y: -10, delay: 1.0 },
    { id: 6, x: 5, y: 38, delay: 1.2 },
    { id: 7, x: -20, y: -35, delay: 1.4 },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="max-w-xs p-4 rounded-[24px] bg-black/60 backdrop-blur-xl border border-white/10 text-white shadow-2xl pointer-events-auto"
            style={{ borderRadius: realm.shape === 'mechanical' ? '4px' : '24px' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3 h-3 text-[var(--theme-primary)]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">{realm.name} Protocol</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robin Body */}
      <motion.div 
        layout
        className="relative group pointer-events-auto cursor-pointer"
        whileHover={realm.motion.hover}
        whileTap={realm.motion.tap}
      >
        {/* Atmosphere / Glow */}
        <motion.div 
          animate={{ 
            scale: action === 'thinking' ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: action === 'thinking' ? 0.4 : (energy / 100) * 0.3,
            filter: energy < 20 ? 'saturate(0)' : 'saturate(1)'
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ backgroundColor: energy < 20 ? '#ef4444' : 'var(--theme-primary)' }}
        />

        {/* Thinking Particles */}
        <AnimatePresence>
          {action === 'thinking' && (
            <div className="absolute inset-[-40px] pointer-events-none">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: p.x,
                    y: p.y
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: p.delay }}
                  className="absolute left-1/2 top-1/2 text-xs"
                >
                  {realm.robin.particles[p.id % realm.robin.particles.length]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Unit */}
        <motion.div
          animate={
            action === 'thinking' 
              ? { rotate: 360 } 
              : realm.robin.idleBehaviors.includes('float') 
                ? { y: [0, -15, 0] }
                : { scale: [1, 1.05, 1] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-black/40 backdrop-blur-3xl border-2 border-white/5 flex items-center justify-center text-4xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden"
          style={{ 
            borderRadius: realm.shape === 'mechanical' ? '8px' : realm.shape === 'hexagonal' ? '30%' : '50%',
            borderColor: realm.material.border
          }}
        >
          {/* Internal Scan Line */}
          <motion.div 
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-[var(--theme-primary)]/40 blur-[1px]"
          />

          <AnimatePresence mode="wait">
            <motion.span
              key={`${action}-${emotion}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
            >
              {action === 'thinking' ? <Brain className="w-8 h-8 text-[var(--theme-primary)]" /> : realm.robin.icon}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Status Mini-Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: (universeState !== 'idle' || energy < 30) ? 1 : 0, x: (universeState !== 'idle' || energy < 30) ? 0 : 20 }}
          className="absolute right-full mr-4 top-1/2 -translate-y-1/2"
        >
          <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 whitespace-nowrap min-w-[120px]">
            <div className="text-[8px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1">
              {energy < 20 && <ShieldAlert className="w-2 h-2 text-red-500" />}
              {realm.name} Vanguard
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${isUniverseStable ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-[9px] font-bold text-white/80">
                  {universeState === 'shifting' ? 'ANCHORING' : energy < 20 ? 'LOW POWER' : action.toUpperCase()}
                </span>
              </div>
              <span className="text-[8px] font-mono text-white/30">{Math.floor(energy)}%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
