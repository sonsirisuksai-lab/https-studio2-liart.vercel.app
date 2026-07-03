// src/components/cosmos/PortalTransition.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';

export const PortalTransition = () => {
  const { isTransitioning, realm } = useRealm();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center bg-black"
        >
          {/* Central Portal Vortex */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 4, 15], 
              rotate: 1080,
              borderRadius: realm.shape === 'mechanical' ? '0%' : '50%'
            }}
            transition={{ duration: 1.2, ease: "circIn" }}
            className="w-40 h-40 blur-[100px] opacity-80"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />

          {/* Cinematic Scanning Line */}
          <motion.div 
            initial={{ y: '-100vh' }}
            animate={{ y: '100vh' }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-white shadow-[0_0_50px_var(--theme-primary),0_0_100px_var(--theme-primary)] z-[210]"
          />

          {/* Realm Name Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute text-center"
          >
             <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">Initializing Realm</div>
             <div className="text-4xl font-black text-white uppercase tracking-tighter">{realm.name}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
