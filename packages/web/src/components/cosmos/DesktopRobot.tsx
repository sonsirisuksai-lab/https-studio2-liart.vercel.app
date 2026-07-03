import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { Radio, X, Wifi, Database } from 'lucide-react';

type RobotState = 'idle' | 'computing' | 'crisis';

export const DesktopRobot = () => {
  const { realm } = useRealm();
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [namiMessage, setNamiMessage] = useState<string>('');
  const [showNami, setShowNami] = useState<boolean>(false);

  // Markdown Helper
  const parseMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-yellow-400 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Trigger Nami Telemetry Alert
  const triggerNami = (message: string) => {
    setNamiMessage(message);
    setShowNami(true);
    // Dismiss automatically after 7 seconds unless it's a crisis
    if (!message.includes('CRITICAL')) {
      const timer = setTimeout(() => {
        setShowNami(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  };

  // WebSocket / CrewEngine mock listener
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.type;
      
      if (type === 'agent:thought' || type === 'agent:dispatch_start') {
        setRobotState('computing');
        triggerNami("🛰️ **TELEMETRY SEQUENCE ACTIVE!** Shipwright and Navigator engines synced. Zoro is training on deck; Franky is recalculating thermal core capacity. Speed: **14.5 knots**.");
      } else if (type === 'agent:error' || type === 'system:mitigation_active') {
        setRobotState('crisis');
        triggerNami("🚨 **TOKEN BUDGET CRITICAL!** Emergency recovery activated. Keep your hands off the core parameters, Captain! Zoro, watch the security perimeter!");
      } else if (type === 'agent:idle') {
        setRobotState('idle');
      } else if (type === 'system:shortcut_focus') {
        const detail = customEvent.detail || {};
        triggerNami(`⚡ **IOS SHORTCUT TRIGGERED!** External automation handshake validated successfully. Focus realm shifted to **${(detail.mode || 'work').toUpperCase()}** environment. Cargo routes verified! 💰`);
      } else if (type === 'cosmos-nfc-scan') {
        const detail = customEvent.detail || {};
        const tag = detail.tag || {};
        triggerNami(`📟 **NFC PHYSICAL COUPLING ENGAGED!** Scanned tag ID [**${tag.id}**] successfully matching **${tag.focusMode}**. Initiating instantaneous system state synchronization! 🍊`);
      }
    };

    window.addEventListener('agent:thought', handleEvent);
    window.addEventListener('agent:dispatch_start', handleEvent);
    window.addEventListener('agent:error', handleEvent);
    window.addEventListener('system:mitigation_active', handleEvent);
    window.addEventListener('agent:idle', handleEvent);
    window.addEventListener('system:shortcut_focus', handleEvent);
    window.addEventListener('cosmos-nfc-scan', handleEvent);

    // Initial warm welcome from Nami
    const welcomeTimer = setTimeout(() => {
      triggerNami("🍊 **NAMI NAVIGATOR ENGINE ONLINE!** WebSocket packet logs linked. Current treasury cache: **+145,200 ฿**. No marine radar pings detected. Standing by for commands, Boss! ⚓");
    }, 2000);

    return () => {
      window.removeEventListener('agent:thought', handleEvent);
      window.removeEventListener('agent:dispatch_start', handleEvent);
      window.removeEventListener('agent:error', handleEvent);
      window.removeEventListener('system:mitigation_active', handleEvent);
      window.removeEventListener('agent:idle', handleEvent);
      window.removeEventListener('system:shortcut_focus', handleEvent);
      window.removeEventListener('cosmos-nfc-scan', handleEvent);
      clearTimeout(welcomeTimer);
    };
  }, []);

  const isCrisis = robotState === 'crisis';
  const isComputing = robotState === 'computing';
  
  const getRobotIcon = () => {
    if (isCrisis) return '⚠️';
    if (isComputing) return '⚙️';
    return realm.robin.icon || '🤖';
  };

  // Render specific effects based on current theme
  const renderThemeEffects = () => {
    switch (realm.id) {
      case 'cyber-neon':
        return (
          <>
            {isComputing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-10px] border-2 border-dashed border-[#00f0ff] rounded-full opacity-50"
              />
            )}
            {isCrisis && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#ff007f]/20 z-10"
              />
            )}
            <div className="absolute inset-0 border-[3px] border-[#00f0ff] mix-blend-screen" />
          </>
        );
      case 'ironman-nano':
        return (
          <>
            {isComputing && (
              <motion.div
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-15px] border border-[#f97316] rounded-full"
                style={{ borderRadius: '50%' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-[#444] to-[#111] opacity-90 -z-10" />
            <div className="absolute inset-0 border-[2px] border-[#f97316]/50 shadow-[inset_0_0_10px_#f97316]" />
            {isCrisis && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], borderColor: ['#ef4444', '#f97316', '#ef4444'] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 border-4 z-10"
              />
            )}
          </>
        );
      case 'venom-liquid':
        return (
          <>
            {isComputing && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], borderRadius: ['50%', '40%', '60%', '50%'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-[-10px] bg-black opacity-80 mix-blend-multiply"
              />
            )}
            <div className="absolute inset-0 bg-black -z-10 shadow-[inset_0_0_20px_#fff]" />
            {isCrisis && (
               <motion.div
                 animate={{ backgroundColor: ['#000', '#333', '#000'] }}
                 transition={{ duration: 0.5, repeat: Infinity }}
                 className="absolute inset-0 mix-blend-difference z-10"
               />
            )}
          </>
        );
      case 'retro-tape':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-10 pointer-events-none" />
            {isComputing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 border-[4px] border-dashed border-[#22c55e]/30 rounded-full"
              />
            )}
            <div className="absolute inset-0 border-[2px] border-[#14532d] bg-[#050505] -z-10" />
            {isCrisis && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute inset-0 bg-[#22c55e]/40 mix-blend-color-dodge z-20"
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[150] pointer-events-none flex items-end justify-end gap-4">
      {/* Nami Floating Telemetry Speech Bubble */}
      <AnimatePresence>
        {showNami && namiMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20 }}
            className="w-80 rounded-2xl bg-black/90 backdrop-blur-xl border border-[#ff9500]/30 shadow-2xl p-4 pointer-events-auto flex flex-col gap-2 relative overflow-hidden"
          >
            {/* Ambient orange glow backing Nami */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff9500]/10 rounded-full blur-2xl -z-10 pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-1.5 text-[#ff9500]">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase font-mono tracking-wider">NAMI NAVIGATION TELEMETRY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono bg-[#ff9500]/15 text-[#ff9500] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" /> STREAMING
                </span>
                <button 
                  onClick={() => setShowNami(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="text-xs text-white/95 font-mono leading-relaxed select-text">
              {parseMarkdown(namiMessage)}
            </div>

            {/* Bottom Telemetry Metrics */}
            <div className="flex items-center justify-between pt-1 text-[8px] font-mono text-white/40 border-t border-white/5">
              <span className="flex items-center gap-1"><Database className="w-2.5 h-2.5 text-cyan-400" /> B/W: 420 Mbps</span>
              <span>WS PORT: 3000</span>
              <span className="text-emerald-400 animate-pulse">● CONNECTED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container to handle vertical elevation drop during crisis */}
      <motion.div
        animate={{
          y: isCrisis ? 30 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center w-20 h-20 pointer-events-auto cursor-pointer shrink-0"
        onClick={() => {
          setRobotState(s => s === 'idle' ? 'computing' : s === 'computing' ? 'crisis' : 'idle');
          triggerNami("🍊 **NAMI NAVIGATOR:** Telemetry logs active! Coordinates synced with Sunny's navigation chart. Fuel is **98.4%**. Treasury surplus: **+24,500 ฿**. No Navy ships spotted! 💰");
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center justify-center w-full h-full"
        >
          {/* Particle Defense Shield (Crisis State) */}
          <AnimatePresence>
            {isCrisis && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-[-15px] rounded-full flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity } }}
                  className="w-full h-full rounded-full border border-dashed shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                  style={{ borderColor: realm.id === 'venom-liquid' ? '#fff' : '#ef4444' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Avatar Body */}
          <motion.div
            animate={
              isComputing 
                ? { rotate: realm.id === 'retro-tape' ? [0, 90, 180, 270, 360] : 360, scale: [1, 1.05, 1] } 
                : isCrisis 
                ? { x: [-3, 3, -3], rotate: [-5, 5, -5] } 
                : { y: [0, -10, 0] }
            }
            transition={{
              rotate: isComputing ? { duration: 4, repeat: Infinity, ease: 'linear' } : { duration: 0.2, repeat: Infinity },
              scale: { duration: 1.5, repeat: Infinity },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0.1, repeat: Infinity }
            }}
            className="w-20 h-20 flex items-center justify-center relative overflow-hidden backdrop-blur-xl shadow-2xl"
            style={{
              borderRadius: realm.shape === 'mechanical' ? '12px' : realm.shape === 'hexagonal' ? '30%' : '50%'
            }}
          >
            {renderThemeEffects()}

            {/* Glowing Base */}
            <motion.div
              animate={{ opacity: isComputing || isCrisis ? [0.4, 0.8, 0.4] : [0.2, 0.5, 0.2] }}
              transition={{ duration: isCrisis ? 0.5 : 2, repeat: Infinity }}
              className="absolute inset-0 blur-xl mix-blend-screen"
              style={{ backgroundColor: isCrisis ? '#ef4444' : 'var(--theme-primary)' }}
            />

            {/* Icon */}
            <span className="text-4xl relative z-30 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ filter: isCrisis ? 'hue-rotate(90deg)' : 'none' }}>
              {getRobotIcon()}
            </span>
            
            {/* Status Label (Hover/Crisis) */}
            <AnimatePresence>
              {(robotState !== 'idle') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap z-40"
                  style={{ color: isCrisis ? '#ef4444' : 'var(--theme-primary)' }}
                >
                  {robotState}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

