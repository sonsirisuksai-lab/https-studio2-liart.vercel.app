import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Zap, Sparkles, Activity, Shield, 
  Cpu, LayoutGrid, Terminal, Search, Mic, 
  ChevronRight, Command, Bell, Settings,
  Database, RefreshCw, Layers, Box, Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealm } from '@/lib/RealmContext';
import { useUniverse } from '@/lib/UniverseContext';
import { useRobin } from '@/lib/RobinContext';
import { Glass } from '@/components/aether/Glass';
import { Label } from '@/components/aether/Typography';

const CommandBridge = () => {
  const navigate = useNavigate();
  const { realmId, realm, setRealm, realms } = useRealm();
  const { energy, universeState, isUniverseStable, restoreSystem, evolveSystem, evolutionLevel } = useUniverse();
  const { say } = useRobin();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'thinking' | 'analyzing'>('idle');
  const systemHealth = Math.floor(energy);

  // Simulate AI Status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: ('idle' | 'thinking' | 'analyzing')[] = ['idle', 'thinking', 'analyzing'];
      setAiStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] p-4 pointer-events-none">
        <div className="max-w-[1800px] mx-auto flex items-start justify-between gap-4">
          
          {/* ZONE 01 & 03: IDENTITY & SYSTEM STATUS */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <Glass 
              blur={30} 
              opacity={0.6} 
              border 
              className="px-5 py-3 rounded-2xl flex items-center gap-4 border-white/5 shadow-2xl group cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-primary)] to-transparent flex items-center justify-center shadow-[0_0_20px_var(--theme-glow)]">
                  <span className="text-xl">{realm.robin.icon}</span>
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 border border-dashed border-[var(--theme-primary)]/20 rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--theme-text)]">COSMOS OS</span>
                  <span className="text-[8px] font-mono bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-1.5 py-0.5 rounded border border-[var(--theme-primary)]/20 font-bold">{realm.name.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-[var(--theme-text-tertiary)] font-bold uppercase tracking-widest">{realmId.toUpperCase()} BRIDGE</span>
                  </div>
                </div>
              </div>
            </Glass>

            {/* SYSTEM STATUS MINI PANEL */}
            <Glass blur={24} opacity={0.3} border className="px-4 py-2 rounded-xl flex items-center gap-4 border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 text-cyan-400" />
                    <span className="text-[8px] font-mono text-white/40 font-bold uppercase">Health</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-black">{systemHealth}%</span>
                </div>
                <div className="w-[1px] h-4 bg-white/5" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Database className="w-2.5 h-2.5 text-purple-400" />
                    <span className="text-[8px] font-mono text-white/40 font-bold uppercase">DB</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 font-black">Online</span>
                </div>
                <div className="w-[1px] h-4 bg-white/5" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 text-emerald-400 animate-spin-slow" />
                    <span className="text-[8px] font-mono text-white/40 font-bold uppercase">Sync</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-black">Active</span>
                </div>
              </div>
            </Glass>
          </div>

          {/* ZONE 02: AI COMMAND CENTER (LIVING PANEL) */}
          <div className="flex-1 max-w-2xl pointer-events-auto">
            <Glass 
              blur={40} 
              opacity={0.8} 
              border 
              className="h-16 px-6 rounded-full flex items-center gap-4 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)] group"
            >
              {/* AI Avatar / Status Indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={aiStatus === 'thinking' ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-[var(--theme-primary)]/20 blur-lg"
                  />
                  <span className="text-xl relative z-10">{realm.robin.body}</span>
                </div>
                {/* Thinking Particles */}
                <AnimatePresence>
                  {aiStatus !== 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-primary)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--theme-primary)]"></span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Command Input Area */}
              <div className="flex-1 flex items-center gap-3">
                <Command className="w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder={`Command in ${realm.name} Realm...`}
                  className="bg-transparent border-none outline-none w-full text-sm font-medium text-[var(--theme-text)] placeholder:text-white/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value;
                      if (val) {
                        say(`รับทราบครับ บอส: ${val}`);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  onFocus={() => {
                    // Optionally trigger MakaPrompt if focused?
                    // For now just keep it as is but functional
                  }}
                />
                <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-[10px] font-mono text-white/40 uppercase font-bold tracking-tighter">CMD+K</span>
                </div>
              </div>

              {/* AI Actions */}
              <div className="flex items-center gap-2 pl-4 border-l border-white/5">
                <button className="p-2 rounded-full hover:bg-white/5 transition-all text-white/40 hover:text-white">
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-maka-prompt'))}
                  className="p-2 rounded-full hover:bg-white/5 transition-all text-white/40 hover:text-white"
                >
                  <Terminal className="w-4 h-4" />
                </button>
              </div>
            </Glass>
          </div>

          {/* ZONE 04 & 05: REALM SWITCHER & MISSION MENU */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Realm Switcher (Portal Selector) */}
            <div className="flex items-center gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5">
              {realms.slice(0, 4).map((r) => (
                <button 
                  key={r.id}
                  onClick={() => setRealm(r.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${
                    realmId === r.id 
                      ? 'bg-[var(--theme-primary)] text-white shadow-[0_0_15px_var(--theme-glow)]' 
                      : 'text-white/30 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r.name}
                </button>
              ))}
              <button className="p-2 text-white/20 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mission Console Trigger */}
            <button 
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className={`p-4 rounded-2xl transition-all border ${
                isConsoleOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black/40 text-white border-white/5 hover:border-white/20'
              }`}
            >
              <LayoutGrid className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MISSION CONSOLE MODAL */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-3xl"
          >
            <div className="w-full max-w-4xl grid grid-cols-12 gap-6 pointer-events-auto">
              {/* Sidebar Info */}
              <div className="col-span-4 flex flex-col gap-6">
                <Glass blur={40} opacity={0.5} border className="p-8 rounded-[40px] flex-1 border-white/5 flex flex-col justify-between">
                  <div>
                    <Heading size="32" className="font-black text-white leading-tight">MISSION<br/>CONTROL</Heading>
                    <p className="text-white/40 text-sm mt-4 leading-relaxed font-medium">
                      Operational center for all cognitive modules and realm orchestrations.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className={`w-2 h-2 rounded-full ${isUniverseStable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <div>
                        <div className="text-[10px] font-black text-white/40 uppercase">Vanguard Engine v{evolutionLevel}.0</div>
                        <div className="text-xs font-bold text-white uppercase">{universeState === 'idle' ? 'LOCKED & STABLE' : universeState.toUpperCase()}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsConsoleOpen(false)}
                      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
                    >
                      Close Console
                    </button>
                  </div>
                </Glass>
              </div>

              {/* Grid Menu */}
              <div className="col-span-8 grid grid-cols-3 gap-4">
                {[
                  { id: 'nexus', icon: <Compass />, label: 'Nexus', color: '#60A5FA' },
                  { id: 'studio', icon: <Mic />, label: 'Studio', color: '#F87171' },
                  { id: 'creative', icon: <Zap />, label: 'Creative', color: '#FBBF24' },
                  { id: 'data', icon: <Database />, label: 'Fusions', color: '#34D399' },
                  { id: 'universe', icon: <Layers />, label: 'Universe', color: '#A78BFA' },
                  { id: 'knowledge', icon: <Box />, label: 'Knowledge', color: '#F472B6' },
                  { id: 'timeline', icon: <Activity />, label: 'Timeline', color: '#FB923C' },
                  { id: 'media', icon: <Maximize2 />, label: 'Media', color: '#2DD4BF' },
                  { id: 'settings', icon: <Settings />, label: 'Settings', color: '#94A3B8' },
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(`/${item.id === 'nexus' ? '' : item.id}`);
                      setIsConsoleOpen(false);
                    }}
                    className="group cursor-pointer"
                  >
                    <Glass blur={24} opacity={0.3} border className="h-40 rounded-[32px] flex flex-col items-center justify-center gap-4 border-white/5 hover:border-white/20 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ backgroundColor: `${item.color}10`, color: item.color }}
                      >
                        <div className="w-7 h-7 flex items-center justify-center">
                          {item.icon}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </Glass>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING COMMAND DOCK */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 pointer-events-auto">
        <Glass blur={30} opacity={0.6} border className="px-6 py-3 rounded-2xl flex items-center gap-3 border-white/10 shadow-2xl">
           <DockButton 
             icon={<Mic className="w-5 h-5" />} 
             label="Voice" 
             onClick={() => say("กำลังฟังอยู่ครับ บอส...")} 
           />
           
           <div className="w-[1px] h-6 bg-white/5 mx-1" />
           
           <DockButton 
             icon={<Sparkles className="w-5 h-5" />} 
             label="Evolve" 
             active={universeState === 'shifting'}
             onClick={evolveSystem} 
           />
           
           <div className="w-[1px] h-10 bg-white/10 mx-1" />
           
           <motion.button 
             onClick={restoreSystem}
             whileHover={{ scale: 1.1, rotate: 90 }}
             whileTap={{ scale: 0.9 }}
             className="p-4 rounded-2xl bg-[var(--theme-primary)] text-white shadow-[0_0_20px_var(--theme-glow)] transition-transform flex items-center justify-center group relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             <RefreshCw className={`w-6 h-6 relative z-10 ${universeState === 'restoring' ? 'animate-spin' : ''}`} />
           </motion.button>
           
           <div className="w-[1px] h-10 bg-white/10 mx-1" />
           
           <DockButton 
             icon={<Bell className="w-5 h-5" />} 
             label="Alerts" 
             onClick={() => navigate('/notifications')} 
           />
           
           <div className="w-[1px] h-6 bg-white/5 mx-1" />
           
           <DockButton 
             icon={<Search className="w-5 h-5" />} 
             label="Find" 
             onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))} 
           />
        </Glass>
      </div>
    </>
  );
};

const DockButton: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, onClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.button 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`group relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as any}
    >
      <div className="relative z-10">
        {icon}
      </div>
      <span className={`absolute -bottom-8 text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap ${
        active ? 'text-[var(--theme-primary)]' : 'text-white/40'
      }`}>
        {label}
      </span>
      
      {/* Magnetic Effect Glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none" />
    </motion.button>
  );
};

// Internal Typography Helper
const Heading = ({ size, className, children }: { size: string, className?: string, children: React.ReactNode }) => (
  <h1 className={className} style={{ fontSize: `${size}px` }}>{children}</h1>
);

export default CommandBridge;
