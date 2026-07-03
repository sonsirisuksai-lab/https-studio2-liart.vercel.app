import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { realms } from '@/lib/realms';
import { useNavigate } from 'react-router-dom';
import { Glass } from '@/components/aether/Glass';
import { Heading, Label } from '@/components/aether/Typography';
import { useRealm } from '@/lib/RealmContext';
import { Sparkles, Compass, Zap, Layers, Clock } from 'lucide-react';
import { AIWorkspace, TimeMachine } from '@/components/cosmos';

const WorkspaceUniverse = () => {
  const navigate = useNavigate();
  const { realmId } = useRealm();
  const [currentTab, setCurrentTab] = useState<'orbital' | 'workspace' | 'timeline'>('orbital');

  // Create an orbital layout for the spheres
  const spheres = useMemo(() => {
    return realms.map((realm, index) => {
      // Calculate position on a circle
      const angle = (index / realms.length) * Math.PI * 2;
      const radius = 280; // Distance from center
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Assign a physical object type based on index (as per AGENTS.md)
      const physicalTypes = [
        'Vinyl', 'Cassette', 'Soul Card', 'DNA', 'Memory Card', 
        'Planet', 'Artifact', 'Crystal', 'Notebook', 'Tablet',
        'Serum', 'Beacon', 'Chronos'
      ];
      
      return {
        ...realm,
        x,
        y,
        physicalType: physicalTypes[index % physicalTypes.length],
        delay: index * 0.1
      };
    });
  }, []);

  const particles = useMemo(() => {
    // Static positions to avoid linter purity errors with Math.random
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 23) % 100}%`,
      duration: 5 + (i % 5),
      delay: i * 0.2
    }));
  }, []);

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-start relative overflow-hidden p-8 select-none pt-4">
      {/* Tab Switcher */}
      <div className="relative z-50 mb-12 flex justify-center">
        <Glass blur={24} opacity={0.5} border className="p-1.5 rounded-2xl flex items-center gap-2 border-white/5 shadow-2xl">
          <button
            onClick={() => setCurrentTab('orbital')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              currentTab === 'orbital'
                ? 'bg-[var(--theme-primary)] text-white shadow-lg'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            Orbital Core
          </button>
          <button
            onClick={() => setCurrentTab('workspace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              currentTab === 'workspace'
                ? 'bg-[var(--theme-primary)] text-white shadow-lg'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            Workspace
          </button>
          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              currentTab === 'timeline'
                ? 'bg-[var(--theme-primary)] text-white shadow-lg'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            Time Machine
          </button>
        </Glass>
      </div>

      {currentTab === 'orbital' ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-[550px]">
          {/* Central Core Reactor */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: 360 
              }}
              transition={{ 
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 40, repeat: Infinity, ease: "linear" }
              }}
              className="w-56 h-56 rounded-full border-2 border-dashed border-[var(--theme-primary)]/30 flex items-center justify-center bg-[var(--theme-primary)]/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(var(--theme-primary-rgb),0.1)] relative"
            >
              {/* Pulsing Outer Ring */}
              <motion.div
                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-[var(--theme-primary)]"
              />
              
              <div className="w-36 h-36 rounded-full border border-[var(--theme-primary)]/50 bg-gradient-to-br from-[var(--theme-primary)]/20 to-transparent flex items-center justify-center shadow-inner">
                 <span className="text-6xl filter drop-shadow-[0_0_15px_var(--theme-primary)]">🌌</span>
              </div>
            </motion.div>
            
            <div className="mt-10 text-center">
              <Label className="text-[var(--theme-primary)] tracking-[0.4em] font-black text-xs">THOUSAND SUNNY NAVIGATION</Label>
              <Heading size="48" className="mt-2 tracking-tighter font-black text-[var(--theme-text)]">CORE SPHERE UNIVERSE</Heading>
              <div className="flex items-center justify-center gap-3 mt-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[var(--theme-text-tertiary)] text-[10px] uppercase tracking-[0.2em] font-mono font-bold">13 Modules Online · Run #4 Stabilized</p>
              </div>
            </div>
          </div>

          {/* Orbiting 13 Core Spheres */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Orbital Path Guides */}
            <div className="absolute w-[560px] h-[560px] rounded-full border border-white/[0.03] pointer-events-none" />
            
            {spheres.map((sphere) => (
              <motion.div
                key={sphere.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: sphere.x,
                  y: sphere.y
                }}
                transition={{ 
                  type: 'spring',
                  delay: sphere.delay,
                  damping: 15,
                  stiffness: 80
                }}
                className="absolute pointer-events-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.2, zIndex: 50, y: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(sphere.id === 'cyber-neon' ? '/' : `/${sphere.id}`)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  {/* The Sphere Visual */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl border backdrop-blur-md relative transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--sphere-glow-rgb),0.3)]"
                    style={{ 
                      backgroundColor: `${(sphere as any).color}15`,
                      borderColor: `${(sphere as any).color}40`,
                      boxShadow: `0 0 20px ${(sphere as any).color}15`,
                      '--sphere-glow-rgb': (sphere as any).color === '#A855F7' ? '168, 85, 247' : '255, 255, 255' // Simplified for demo
                    } as any}
                  >
                    {/* Floating Orbiting Ring */}
                    <motion.div 
                      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                      transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute inset-[-12px] rounded-full border border-dashed opacity-10 group-hover:opacity-40 transition-opacity"
                      style={{ borderColor: (sphere as any).color }}
                    />
                    
                    <span className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-lg">
                      {(sphere as any).icon}
                    </span>
                    
                    {/* Visual Glow Core */}
                    <div 
                      className="absolute inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
                      style={{ backgroundColor: (sphere as any).color }}
                    />
                    
                    {/* Detailed Label Card (The "Function") */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none">
                       <Glass 
                        blur={24} 
                        opacity={0.9} 
                        border 
                        className="px-4 py-2 rounded-xl shadow-2xl border-white/10 flex flex-col items-center gap-0.5"
                       >
                         <div className="text-[10px] font-black uppercase tracking-wider text-white" style={{ color: (sphere as any).color }}>
                           {sphere.name}
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/40" />
                            <div className="text-[8px] font-mono text-white/50 uppercase tracking-[0.2em] font-bold">
                              OBJECT: {sphere.physicalType}
                            </div>
                         </div>
                       </Glass>
                       {/* Pointer arrow */}
                       <div className="w-2 h-2 bg-white/10 rotate-45 mx-auto -mt-1 border-t border-l border-white/10" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : currentTab === 'workspace' ? (
        <div className="w-full max-w-5xl relative z-30">
          <AIWorkspace />
        </div>
      ) : (
        <div className="w-full max-w-5xl relative z-30">
          <TimeMachine />
        </div>
      )}
      
      {/* System Command Console Legend */}
      <div className="mt-12 relative z-30 flex items-center justify-center gap-8">
        <Glass blur={30} opacity={0.4} border className="px-8 py-4 rounded-2xl flex items-center gap-10 border-white/5 shadow-2xl">
           <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2">
               <Zap className="w-4 h-4 text-emerald-400" />
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Vanguard Engine</div>
             </div>
             <div className="text-[8px] font-mono text-white/30 font-bold">RUN #4 STABLE</div>
           </div>
           
           <div className="w-[1px] h-8 bg-white/10" />
           
           <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2">
               <Compass className="w-4 h-4 text-cyan-400" />
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Spatial Logic</div>
             </div>
             <div className="text-[8px] font-mono text-white/30 font-bold">13 CORES SYNCED</div>
           </div>
           
           <div className="w-[1px] h-8 bg-white/10" />
           
           <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-purple-400" />
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Agentic Matrix</div>
             </div>
             <div className="text-[8px] font-mono text-white/30 font-bold">ZORO APPROVED</div>
           </div>
        </Glass>
      </div>

      {/* Atmospheric Particles (Simplified) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              delay: p.delay
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{ 
              left: p.left, 
              top: p.top 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkspaceUniverse;
