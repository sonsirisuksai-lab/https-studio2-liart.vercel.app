import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Mic, Clipboard, FileUp, 
  Sparkles, Zap, Box, Layers,
  Search, Plus, History, Brain,
  ChevronRight, ArrowRight, Share2,
  Database, Clock, Link as LinkIcon,
  Scan, Globe, Youtube, Mail,
  Maximize2, MoreHorizontal, Check,
  Cpu, Activity
} from 'lucide-react';
import { Glass } from '@/components/aether/Glass';
import { Heading, Label } from '@/components/aether/Typography';
import { useRealm } from '@/lib/RealmContext';
import { useNavigate } from 'react-router-dom';

import { useRobin } from '@/lib/RobinContext';

export const CaptureUniverse = () => {
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { triggerThinking, say, setAction } = useRobin();
  const [activeCapture, setActiveCapture] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<number>(0);
  
  const handleCapture = (id: string) => {
    setActiveCapture(id);
    setProcessingStage(1);
    triggerThinking(5000);
    say("Captain, I'm scanning this artifact now. Let's see what secrets it holds...");
  };

  // Simulated Processing States
  useEffect(() => {
    if (activeCapture) {
      const timers = [
        setTimeout(() => setProcessingStage(2), 1200),
        setTimeout(() => setProcessingStage(3), 2500),
        setTimeout(() => setProcessingStage(4), 4000),
        setTimeout(() => {
          setProcessingStage(0);
          setActiveCapture(null);
        }, 5500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [activeCapture]);

  // Capture Categories
  const categories = [
    { id: 'visual', icon: <Camera />, label: 'Visual', desc: 'Photos, Screenshots, Camera' },
    { id: 'voice', icon: <Mic />, label: 'Voice', desc: 'Audio, Meeting, Voice Note' },
    { id: 'intel', icon: <Globe />, label: 'Intelligence', desc: 'URLs, YouTube, Articles' },
    { id: 'files', icon: <FileUp />, label: 'Documents', desc: 'PDF, Word, Spreadsheet' },
  ];

  // Recent Artifacts (Physical Form)
  const recentCaptures = [
    { id: 'c1', type: 'Book', title: 'The Future of AI', color: '#60A5FA', icon: '📚' },
    { id: 'c2', type: 'Cassette', title: 'Product Meeting 03/07', color: '#FBBF24', icon: '📼' },
    { id: 'c3', type: 'Crystal', title: 'Aether Logic Idea', color: '#A78BFA', icon: '💎' },
    { id: 'c4', type: 'Blueprint', title: 'COSMOS Layout', color: '#34D399', icon: '📐' },
  ];

  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${(i * 13) % 100}%`,
      top: `${(i * 19) % 100}%`,
      duration: 3 + (i % 4),
      delay: i * 0.1
    }));
  }, []);

  return (
    <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12 relative min-h-[90vh]">
      
      {/* ─── ATMOSPHERIC BACKGROUND ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{ 
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            className="absolute w-2 h-2 rounded-full bg-[var(--theme-primary)]/20 blur-sm"
            style={{ left: p.left, top: p.top }}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 py-8 relative z-10">
        
        {/* ─── LEFT: CAPTURE CONTROL (8 COLUMNS) ─── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <div className="flex flex-col gap-2">
            <Label className="text-[var(--theme-primary)] tracking-[0.4em] font-black">UNIVERSAL CAPTURE PIPELINE</Label>
            <Heading size="48" className="font-black text-white tracking-tighter">WHATS ON YOUR MIND?</Heading>
          </div>

          {/* THE CAPTURE PORTAL (MAIN INTERACTIVE ZONE) */}
          <Glass blur={40} opacity={0.6} border className="p-16 rounded-[60px] border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
             {/* Portal Pulse */}
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/5 to-transparent pointer-events-none" />
             
             <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCapture('universal')}
                  className="w-48 h-48 rounded-full bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-[var(--theme-primary)]/40 transition-all shadow-inner relative"
                >
                   {/* Orbiting Ring */}
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute -inset-4 border border-dashed border-[var(--theme-primary)]/10 rounded-full"
                   />
                   
                   <div className="flex flex-col items-center gap-2">
                      <Plus className="w-12 h-12 text-white/20 group-hover:text-[var(--theme-primary)] transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Drop or Click</span>
                   </div>
                </motion.div>
                
                <div className="mt-12 grid grid-cols-4 gap-6 w-full">
                   {categories.map((cat) => (
                     <button 
                        key={cat.id}
                        className="flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-white/5 transition-all group/btn"
                        onClick={() => handleCapture(cat.id)}
                     >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover/btn:text-[var(--theme-primary)] group-hover/btn:scale-110 transition-all">
                           {cat.icon}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover/btn:text-white transition-colors">{cat.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             {/* PROCESSING OVERLAY (ALIVE MOTION) */}
             <AnimatePresence>
                {activeCapture && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-12"
                  >
                     <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Scanning Effect */}
                        <motion.div 
                          animate={{ y: [-120, 120, -120] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--theme-primary)]/20 to-transparent h-1"
                        />
                        
                        <div className="relative z-10 flex flex-col items-center gap-6">
                           <div className="text-6xl animate-bounce">📦</div>
                           <div className="flex flex-col items-center gap-1 text-center">
                              <Label className="text-[var(--theme-primary)]">
                                {processingStage === 1 && "SCANNING OBJECT..."}
                                {processingStage === 2 && "EXTRACTING KNOWLEDGE..."}
                                {processingStage === 3 && "MAPPING RELATIONSHIPS..."}
                                {processingStage === 4 && "FINALIZING MEMORY..."}
                              </Label>
                              <div className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest">
                                 AI Analysis in progress
                              </div>
                           </div>
                           
                           {/* Stage Indicators */}
                           <div className="flex items-center gap-2 mt-4">
                              {[1, 2, 3, 4].map((s) => (
                                <div 
                                  key={s} 
                                  className={`w-8 h-1 rounded-full transition-all duration-500 ${
                                    processingStage >= s ? 'bg-[var(--theme-primary)]' : 'bg-white/10'
                                  }`} 
                                />
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </Glass>

          {/* CAPTURE FEED (TIME RIVER) */}
          <div className="space-y-6 pt-4">
             <div className="flex items-center justify-between">
                <Label>🌌 TODAY'S DISCOVERIES</Label>
                <div className="flex items-center gap-2">
                   <Clock className="w-3 h-3 text-white/20" />
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">July 03, 2026</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentCaptures.map((item) => (
                  <Glass key={item.id} blur={24} opacity={0.4} border className="p-6 rounded-[32px] border-white/5 flex items-center gap-6 group cursor-pointer hover:bg-white/5 transition-all">
                     <div 
                        className="w-20 h-20 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all"
                        style={{ backgroundColor: `${item.color}10` }}
                     >
                        {item.icon}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
                           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Captured by AI Vision</span>
                        </div>
                        <div className="text-sm font-black text-white group-hover:text-[var(--theme-primary)] transition-colors">{item.title}</div>
                        <div className="flex items-center gap-3 mt-3">
                           <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/20 font-bold uppercase">
                              <Layers className="w-2.5 h-2.5" />
                              {item.type}
                           </div>
                           <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/20 font-bold uppercase">
                              <Brain className="w-2.5 h-2.5" />
                              Analyzed
                           </div>
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                  </Glass>
                ))}
             </div>
          </div>
        </div>

        {/* ─── RIGHT: AI ANALYTICS & ROBOT (4 COLUMNS) ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* AI INTELLIGENCE HUB */}
          <Glass blur={30} opacity={0.8} border className="p-8 rounded-[40px] border-[var(--theme-primary)]/20 bg-[var(--theme-primary)]/5">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl">🧠</div>
                <div>
                   <Label className="text-[var(--theme-primary)]">CAPTURE INTELLIGENCE</Label>
                   <div className="text-[10px] font-mono text-white/40 font-bold uppercase">Mapping Neural Paths</div>
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Topic Extraction</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTIVE</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {['Design System', 'AI Ethics', 'React 19', 'OS Theory'].map(t => (
                        <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-white/60">#{t}</span>
                      ))}
                   </div>
                </div>
                
                <div className="w-full h-[1px] bg-white/5" />
                
                <div className="space-y-4">
                   <Label className="text-[8px] opacity-40">AUTO-RELATIONSHIPS</Label>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group cursor-pointer hover:border-[var(--theme-primary)]/20">
                         <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Layers className="w-4 h-4" />
                         </div>
                         <div className="flex-1">
                            <div className="text-[9px] font-black text-white">Linked to "Aether Project"</div>
                            <div className="text-[8px] font-mono text-white/20 uppercase font-bold">Shared Context Detected</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group cursor-pointer hover:border-[var(--theme-primary)]/20">
                         <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Plus className="w-4 h-4" />
                         </div>
                         <div className="flex-1">
                            <div className="text-[9px] font-black text-white">New Task: "Review OS Draft"</div>
                            <div className="text-[8px] font-mono text-white/20 uppercase font-bold">Actionable Item Found</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </Glass>

          {/* ROBOT ASSISTANT (ROBIN) */}
          <Glass blur={24} opacity={0.4} border className="p-8 rounded-[40px] border-white/5 flex flex-col items-center gap-6 group overflow-hidden relative">
             {/* Background Scan Effect */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary)]/20 blur-sm group-hover:translate-y-40 transition-all duration-[3000ms]" />
             
             <div className="w-32 h-32 rounded-full bg-black/40 flex items-center justify-center text-6xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all">🤖</div>
             <div className="text-center">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Robin Vanguard</div>
                <div className="text-sm font-bold text-white leading-relaxed">
                   "Captain, I've just analyzed your clipboard. Should I connect this code snippet to the <span className="text-[var(--theme-primary)]">Layout Engine</span> mission?"
                </div>
             </div>
             
             <div className="flex items-center gap-3 w-full">
                <button className="flex-1 py-3 rounded-2xl bg-[var(--theme-primary)] text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_var(--theme-glow)]">Yes, Link it</button>
                <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">Ignore</button>
             </div>
          </Glass>

          {/* CAPTURE STATS (ENERGY/STABILITY) */}
          <div className="grid grid-cols-2 gap-4">
             <Glass blur={24} opacity={0.3} border className="p-4 rounded-3xl border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <Cpu className="w-3 h-3 text-cyan-400" />
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Neural Load</span>
                </div>
                <div className="text-lg font-mono font-black text-white">12%</div>
             </Glass>
             <Glass blur={24} opacity={0.3} border className="p-4 rounded-3xl border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <Activity className="w-3 h-3 text-emerald-400" />
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Stability</span>
                </div>
                <div className="text-lg font-mono font-black text-white">STABLE</div>
             </Glass>
          </div>
        </div>

      </div>

      {/* QUICK COMMAND DOCK (CONTEXTUAL) */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
         <motion.button 
            whileHover={{ y: -5 }}
            className="px-8 py-4 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3"
         >
            <Plus className="w-4 h-4" />
            New Capture
         </motion.button>
         <motion.button 
            whileHover={{ y: -5 }}
            className="p-4 rounded-3xl bg-black/60 backdrop-blur-3xl border border-white/10 text-white shadow-2xl"
         >
            <Search className="w-5 h-5" />
         </motion.button>
      </div>

    </div>
  );
};


