import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { Network, Cpu, Code2, Activity, Zap, Server, Database, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'core', label: 'Core', icon: Cpu, desc: 'Central Processing & Neural Links' },
  { id: 'logistics', label: 'Logistics', icon: Layers, desc: 'Logistics Gateway & Hardware' },
  { id: 'archive', label: 'History', icon: Database, desc: 'Archive of History & Memory' },
  { id: 'api', label: 'API', icon: Code2, desc: 'External Gateway & Webhooks' },
  { id: 'agent', label: 'Agent Network', icon: Network, desc: 'Autonomous Crew Routing' }
];

export const RealmNavigationHUD = () => {
  const { realm } = useRealm();
  const [activeTab, setActiveTab] = useState('core');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Telemetry stream mock
  const [telemetry, setTelemetry] = useState<string[]>([]);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newLog = `[${new Date().toISOString().split('T')[1].slice(0,-1)}] Stream ${activeTab.toUpperCase()}: ${Math.random().toString(36).substring(7)}`;
        return [newLog, ...prev].slice(0, 5);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen, activeTab]);

  const getKineticTransition = () => {
    switch (realm.id) {
      case 'cyber-neon': return { type: 'spring', stiffness: 500, damping: 25 }; 
      case 'ironman-nano': return { type: 'spring', stiffness: 400, damping: 30, mass: 1.5 };
      case 'venom-liquid': return { type: 'spring', stiffness: 50, damping: 20 };
      default: return { type: 'spring', stiffness: 300, damping: 30 };
    }
  };

  const handleTabClick = (id: string, e: React.MouseEvent) => {
    // Generate ripple or expansion from click point
    // We will keep it simple and just switch active tab with a motion layout
    setActiveTab(id);
    if (id === "archive") {
      navigate("/archive");
    } else if (id === "logistics") {
      navigate("/logistics");
    } else if (id === "core") {
      navigate("/");
    }
  };

  return (
    <div className="fixed top-24 left-8 z-[130] flex flex-col pointer-events-none">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 hover:border-[var(--theme-primary)]/40 transition-all text-[var(--theme-text)] bg-black/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Server className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={getKineticTransition()}
            className="pointer-events-auto mt-4 w-[320px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Blueprint Background */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            <div className="p-2 flex gap-1 bg-black/20 border-b border-white/5 relative z-10">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={(e) => handleTabClick(tab.id, e)}
                    className={`relative flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors z-10 ${isActive ? 'text-[var(--theme-primary)]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabHilight"
                        className="absolute inset-0 bg-[var(--theme-primary)]/10 rounded-lg border border-[var(--theme-primary)]/30 -z-10"
                        transition={getKineticTransition()}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 relative z-10 min-h-[200px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <h3 className="text-sm font-bold text-[var(--theme-text)] mb-1">
                    {TABS.find(t => t.id === activeTab)?.desc}
                  </h3>
                  
                  {/* Miniature Stream Viewport */}
                  <div className="mt-4 flex-1 bg-black/60 border border-white/5 rounded-lg p-2 font-mono text-[10px] overflow-hidden relative">
                    <div className="flex items-center gap-2 mb-2 text-[var(--theme-primary)] border-b border-white/10 pb-1">
                      <Zap className="w-3 h-3 animate-pulse" />
                      <span>LIVE TELEMETRY STREAM</span>
                    </div>
                    <div className="flex flex-col gap-1 text-white/60">
                      {telemetry.map((log, i) => (
                        <motion.div 
                          key={`${log}-${i}`}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="truncate"
                        >
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
