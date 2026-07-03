import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { Camera, AlertTriangle, Activity, Database, Server, Copy, Check } from 'lucide-react';
import { Glass } from '../aether/Glass';

export const UltimateCaptureSuite = () => {
  const { realm } = useRealm();
  const [isCrisis, setIsCrisis] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [snapshotData, setSnapshotData] = useState('');
  const [copied, setCopied] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  // Crisis Event Listener
  useEffect(() => {
    const handleCrisis = (e: Event) => {
      setIsCrisis(true);
      // Auto dismiss crisis after 10s for demo
      setTimeout(() => setIsCrisis(false), 10000);
    };

    window.addEventListener('system:mitigation_active', handleCrisis);
    window.addEventListener('system:mitigation_duplicate_intercepted', handleCrisis);

    return () => {
      window.removeEventListener('system:mitigation_active', handleCrisis);
      window.removeEventListener('system:mitigation_duplicate_intercepted', handleCrisis);
    };
  }, []);

  const handleCapture = (e: React.MouseEvent) => {
    setClickPos({ x: e.clientX, y: e.clientY });
    
    // Generate Snapshot
    const data = `
# SYSTEM SNAPSHOT [${new Date().toISOString()}]
## REALM: ${realm.name} (${realm.id})

### METRICS
- Token Health: ${Math.floor(Math.random() * 30 + 70)}%
- Active Dispatches: ${Math.floor(Math.random() * 5)}
- Agent Status: ONLINE
- DB Latency: ${Math.floor(Math.random() * 20 + 5)}ms
- Error Rate: 0.00%

### SYSTEM LOGS
[INFO] Telemetry active
[INFO] Layout rendering stable
`;
    setSnapshotData(data.trim());
    setShowSnapshot(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snapshotData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCrisisAnimation = () => {
    switch (realm.id) {
      case 'venom-liquid':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none bg-black/90 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Fluid blood-red boiling shapes */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ['-100vh', '100vh'],
                  scale: [1, 2, 1],
                  borderRadius: ['30%', '50%', '20%']
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
                className="absolute w-[60vw] h-[60vw] bg-[#990000] mix-blend-screen opacity-70 blur-3xl"
                style={{ left: `${(i / 5) * 100}%` }}
              />
            ))}
            <AlertTriangle className="w-32 h-32 text-red-600 animate-pulse z-10" />
            <h1 className="text-6xl font-black text-red-600 tracking-[0.2em] mt-8 z-10 text-center">
              SYSTEM MITIGATION<br/>ACTIVE
            </h1>
          </motion.div>
        );
      case 'ironman-nano':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-black/95 overflow-hidden"
          >
            <div className="absolute inset-0 border-[20px] border-amber-500/50 animate-pulse z-0" />
            {/* Tactical Hazard Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[80vw] h-[80vw] border-2 border-dashed border-amber-500/30 rounded-full z-0" 
            />
            <AlertTriangle className="w-32 h-32 text-amber-500 animate-pulse z-10" />
            <h1 className="text-6xl font-black text-amber-500 tracking-[0.2em] mt-8 z-10 text-center uppercase">
              Tactical Override
            </h1>
          </motion.div>
        );
      case 'cyber-neon':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-black/95 overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 bg-red-600/30 mix-blend-overlay z-0"
            />
            <div className="absolute top-0 left-0 right-0 h-16 bg-red-600/50 shadow-[0_0_50px_red] animate-pulse" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-red-600/50 shadow-[0_0_50px_red] animate-pulse" />
            <AlertTriangle className="w-32 h-32 text-[#ff007f] shadow-[0_0_30px_#ff007f] z-10" />
            <h1 className="text-6xl font-black text-[#ff007f] tracking-[0.2em] mt-8 z-10 text-center" style={{ textShadow: '0 0 20px #ff007f' }}>
              CRITICAL ERROR
            </h1>
          </motion.div>
        );
      default:
        // Generic Emergency
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none bg-red-900/90 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <AlertTriangle className="w-32 h-32 text-white animate-ping" />
            <h1 className="text-6xl font-black text-white mt-8 tracking-widest text-center uppercase">
              Lockdown
            </h1>
          </motion.div>
        );
    }
  };

  const getKineticTransition = () => {
    switch (realm.id) {
      case 'cyber-neon': return { type: 'spring', stiffness: 500, damping: 25 }; // Laser fast
      case 'ironman-nano': return { type: 'spring', stiffness: 400, damping: 30, mass: 1.5 }; // Nano assembly ticks
      case 'venom-liquid': return { type: 'spring', stiffness: 50, damping: 20 }; // Fluid slow drag
      default: return { type: 'spring', stiffness: 300, damping: 30 };
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCrisis && renderCrisisAnimation()}
      </AnimatePresence>

      <div className="fixed bottom-12 left-12 z-[140] flex items-end justify-start pointer-events-none">
        <button
          ref={buttonRef}
          onClick={handleCapture}
          className="pointer-events-auto group relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'rgba(var(--theme-primary-rgb), 0.1)',
            border: '1px solid var(--theme-primary)',
            boxShadow: '0 0 20px rgba(var(--theme-primary-rgb), 0.3)'
          }}
        >
          <motion.div
             className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(circle at center, var(--theme-primary) 0%, transparent 70%)' }}
          />
          <Camera className="w-6 h-6 relative z-10" style={{ color: 'var(--theme-text)' }} />
          <div className="absolute bottom-1 text-[8px] font-bold uppercase tracking-widest opacity-60">SCAN</div>
        </button>
      </div>

      <AnimatePresence>
        {showSnapshot && (
          <motion.div
            initial={{ opacity: 0, clipPath: `circle(0% at ${clickPos.x}px ${clickPos.y}px)` }}
            animate={{ opacity: 1, clipPath: `circle(150% at ${clickPos.x}px ${clickPos.y}px)` }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={getKineticTransition()}
            className="fixed inset-0 z-[160] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSnapshot(false);
            }}
          >
            <Glass className="w-full max-w-2xl max-h-[80vh] flex flex-col border border-[var(--theme-primary)]/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--theme-primary)]" />
                  <span className="font-bold text-lg tracking-widest">DIAGNOSTIC HUD</span>
                </div>
                <button 
                  onClick={() => setShowSnapshot(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-bold"
                >
                  CLOSE
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto font-mono text-sm">
                <div className="relative group">
                  <pre className="text-[var(--theme-text-secondary)] whitespace-pre-wrap">{snapshotData}</pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-0 right-0 p-2 bg-[var(--theme-primary)]/20 hover:bg-[var(--theme-primary)]/40 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                   <div className="p-4 bg-white/5 rounded border border-white/5 flex flex-col gap-2">
                     <Database className="w-5 h-5 text-blue-400" />
                     <span className="text-xs opacity-50">Token Health</span>
                     <span className="text-xl font-bold">STABLE</span>
                   </div>
                   <div className="p-4 bg-white/5 rounded border border-white/5 flex flex-col gap-2">
                     <Server className="w-5 h-5 text-emerald-400" />
                     <span className="text-xs opacity-50">Operations</span>
                     <span className="text-xl font-bold">NOMINAL</span>
                   </div>
                   <div className="p-4 bg-white/5 rounded border border-white/5 flex flex-col gap-2">
                     <AlertTriangle className="w-5 h-5 text-green-400" />
                     <span className="text-xs opacity-50">Error State</span>
                     <span className="text-xl font-bold">CLEAN</span>
                   </div>
                </div>
              </div>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
