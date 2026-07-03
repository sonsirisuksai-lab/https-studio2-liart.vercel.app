import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';

export const GlobalCrisisCanvas = () => {
  const { realm } = useRealm();
  const [isCrisis, setIsCrisis] = useState(false);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.type;
      if (type === 'agent:error' || type === 'system:mitigation_active') {
        setIsCrisis(true);
      } else if (type === 'agent:idle' || type === 'system:mitigation_resolved') {
        setIsCrisis(false);
      }
    };

    window.addEventListener('agent:error', handleEvent);
    window.addEventListener('system:mitigation_active', handleEvent);
    window.addEventListener('agent:idle', handleEvent);
    window.addEventListener('system:mitigation_resolved', handleEvent);

    return () => {
      window.removeEventListener('agent:error', handleEvent);
      window.removeEventListener('system:mitigation_active', handleEvent);
      window.removeEventListener('agent:idle', handleEvent);
      window.removeEventListener('system:mitigation_resolved', handleEvent);
    };
  }, []);

  const renderCrisisEffects = () => {
    switch (realm.id) {
      case 'cyber-neon':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[80]"
          >
             <motion.div
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-red-600 mix-blend-color-burn"
             />
             <div className="absolute inset-0 border-[10px] border-red-600 shadow-[inset_0_0_50px_red] animate-pulse" />
          </motion.div>
        );
      case 'ironman-nano':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[80]"
          >
             <div className="absolute inset-0 border-[20px] border-amber-500/30 border-dashed animate-pulse" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
               className="absolute -top-[50vw] -left-[50vw] w-[200vw] h-[200vw] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(245,158,11,0.1)_70%)]"
             />
          </motion.div>
        );
      case 'venom-liquid':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[80]"
          >
            <motion.div
                animate={{ scale: [1, 1.1, 1], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(150,0,0,0.5)_100%)] mix-blend-multiply"
             />
          </motion.div>
        );
      case 'retro-tape':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[80]"
          >
             <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/20 mix-blend-color-dodge"
             />
             {Array.from({ length: 5 }).map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ y: ['-100vh', '100vh'] }}
                 transition={{ duration: Math.random() * 0.5 + 0.1, repeat: Infinity, ease: 'linear' }}
                 className="absolute left-0 right-0 h-8 bg-red-500/40 mix-blend-overlay"
                 style={{ top: `${Math.random() * 100}%` }}
               />
             ))}
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[80] bg-red-900/20 border-[5px] border-red-500 animate-pulse"
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isCrisis && renderCrisisEffects()}
    </AnimatePresence>
  );
};
