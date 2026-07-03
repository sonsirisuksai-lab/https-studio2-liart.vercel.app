import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Activity, Cpu, LayoutGrid, Target, Layers, Zap, Sparkles
} from 'lucide-react';
import { Glass } from '@/components/aether/Glass';
import { Heading, Label } from '@/components/aether/Typography';
import { useRealm } from '@/lib/RealmContext';
import { useNavigate } from 'react-router-dom';
import { useRobin } from '@/lib/RobinContext';
import { useUniverse } from '@/lib/UniverseContext';
import { PhysicalObject } from '@/components/cosmos/PhysicalObject';
import { StatCard } from '@/components/cosmos/StatCard';
import { ActivityChart } from '@/components/cosmos/ActivityChart';
import { BioMembrane } from '@/components/cosmos/BioMembrane';
import { BridgeHero } from '@/components/cosmos/BridgeHero';
import { CrewBroadcast } from '@/components/cosmos/CrewBroadcast';
import { QuickCapture } from '@/components/cosmos/QuickCapture';
import { ThemeSelector } from '@/components/cosmos/ThemeSelector';
import { DatabaseMatrix } from '@/components/cosmos/DatabaseMatrix';
import { Timeline } from '@/components/cosmos/Timeline';

export const NexusDashboard = () => {
  const navigate = useNavigate();
  const { realm, realmId } = useRealm();
  const { say } = useRobin();
  const { energy, universeState, isUniverseStable, evolutionLevel } = useUniverse();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulating initialization
    const initTimer = setTimeout(() => {
      setIsSyncing(false);
      say("ยินดีต้อนรับกลับสู่สะพานเดินเรือครับ บอส ระบบทั้งหมดออนไลน์แล้ว");
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(initTimer);
    };
  }, [say]);

  return (
    <div className="w-full min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)]">
      
      {/* ─── SYSTEM ACTION OVERLAY ─── */}
      <AnimatePresence>
        {(isSyncing || universeState === 'restoring' || universeState === 'shifting') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-2 border-dashed border-[var(--theme-primary)]/30 rounded-full flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-[var(--theme-primary)]/10 rounded-full blur-2xl animate-pulse" />
            </motion.div>
            <Label className="mt-8 tracking-[0.5em] text-[var(--theme-primary)] font-black text-sm">
              {universeState === 'restoring' ? 'RESTORING CORE ENERGY' : universeState === 'shifting' ? 'EVOLVING SYSTEM ARCHITECTURE' : 'LOCALIZING REALM OBJECTS'}
            </Label>
            <div className="mt-4 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 3 }}
                 className="h-full bg-[var(--theme-primary)]" 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── THE BRIDGE LAYOUT ─── */}
      <div className="max-w-[1920px] mx-auto p-6 lg:p-12 space-y-12">
        
        {/* BRIDGE TOP: IDENTITY & HERO */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
           <BridgeHero />
        </motion.section>

        {/* BRIDGE CENTER: PRIMARY COMMANDS */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start"
        >
          
          {/* LEFT COLUMN: BROADCAST & ACTIVITY */}
          <div className="xl:col-span-1 space-y-8">
            <ThemeSelector />
            <CrewBroadcast />
            <Timeline />
          </div>

          {/* CENTER COLUMNS: QUICK CAPTURE & OBJECTS */}
          <div className="xl:col-span-2 space-y-8">
             <QuickCapture />

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="space-y-4"
             >
               <div className="flex items-center justify-between px-2">
                 <Label className="text-[var(--theme-text)]/40 uppercase tracking-[0.2em] font-black text-[10px]">Physical Artifacts</Label>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <PhysicalObject type="vinyl" title="Neon Sunset" onClick={() => navigate('/capture?id=o1')} />
                 <PhysicalObject type="cassette" title="Lo-Fi Dimension" onClick={() => navigate('/capture?id=o2')} />
                 <PhysicalObject type="soul-card" title="The Architect" onClick={() => navigate('/capture?id=o3')} />
                 <PhysicalObject type="orb" title="Core Sample" onClick={() => navigate('/capture?id=o4')} />
               </div>
             </motion.div>
          </div>

          {/* RIGHT COLUMN: KNOWLEDGE MATRIX & DIAGNOSTICS */}
          <div className="xl:col-span-1 space-y-8">
             <DatabaseMatrix />
             
             <div className="space-y-4">
               <Label className="px-2 text-[var(--theme-text)]/40 uppercase tracking-[0.2em] font-black text-[10px]">System Diagnostics</Label>
               <ActivityChart />
             </div>
          </div>

        </motion.section>

        {/* BRIDGE BOTTOM: PERFORMANCE & HEALTH */}
        <footer className="grid grid-cols-1 md:grid-cols-5 gap-4 border-t border-[var(--theme-text)]/10 pt-8">
           <StatCard label="Artifacts" value="342" icon={<Target className="w-4 h-4" />} trend="+12% Shift" />
           <StatCard label="Neural Load" value="1.2M" icon={<Cpu className="w-4 h-4" />} trend="Optimized" />
           <StatCard label="Core Energy" value={`${Math.floor(energy)}%`} icon={<Zap className="w-4 h-4" />} trend={isUniverseStable ? "Charging" : "Expending"} color="var(--theme-primary)" />
           <StatCard label="Dimension" value={realmId.toUpperCase()} icon={<Layers className="w-4 h-4" />} trend="Active" />
           <StatCard label="System Version" value={`v${evolutionLevel}.0`} icon={<Sparkles className="w-4 h-4" />} trend="Evolutionary" color="var(--theme-primary)" />
        </footer>

      </div>

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-[-1] opacity-30 pointer-events-none">
        <BioMembrane />
      </div>

    </div>
  );
};
