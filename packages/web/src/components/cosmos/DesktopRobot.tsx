import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';

type RobotState = 'idle' | 'computing' | 'crisis';

export const DesktopRobot = () => {
  const { realm } = useRealm();
  const [robotState, setRobotState] = useState<RobotState>('idle');

  // WebSocket / CrewEngine mock listener
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.type;
      if (type === 'agent:thought' || type === 'agent:dispatch_start') {
        setRobotState('computing');
      } else if (type === 'agent:error' || type === 'system:mitigation_active') {
        setRobotState('crisis');
      } else if (type === 'agent:idle') {
        setRobotState('idle');
      }
    };

    window.addEventListener('agent:thought', handleEvent);
    window.addEventListener('agent:dispatch_start', handleEvent);
    window.addEventListener('agent:error', handleEvent);
    window.addEventListener('system:mitigation_active', handleEvent);
    window.addEventListener('agent:idle', handleEvent);

    return () => {
      window.removeEventListener('agent:thought', handleEvent);
      window.removeEventListener('agent:dispatch_start', handleEvent);
      window.removeEventListener('agent:error', handleEvent);
      window.removeEventListener('system:mitigation_active', handleEvent);
      window.removeEventListener('agent:idle', handleEvent);
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
    <div className="fixed bottom-12 right-12 z-[150] pointer-events-none flex flex-col items-center justify-end w-32 h-48">
      {/* Container to handle vertical elevation drop during crisis */}
      <motion.div
        animate={{
          y: isCrisis ? 30 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center w-full h-full pointer-events-auto cursor-pointer"
        onClick={() => {
           setRobotState(s => s === 'idle' ? 'computing' : s === 'computing' ? 'crisis' : 'idle');
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
                className="absolute inset-[-40px] rounded-full flex items-center justify-center pointer-events-none"
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
