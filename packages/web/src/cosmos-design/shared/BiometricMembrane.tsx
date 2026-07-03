import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { playMechanicalSound } from './MechanicalSound';

export const BiometricMembrane: React.FC<{
  children: React.ReactNode;
  isLocked: boolean;
  onUnlock: () => void;
}> = ({ children, isLocked, onUnlock }) => {
  const [isMelting, setIsMelting] = useState(false);

  const handleUnlock = () => {
    playMechanicalSound('click');
    setIsMelting(true);
    setTimeout(() => {
      onUnlock();
      setIsMelting(false);
    }, 1500); // 1.5s melt animation
  };

  return (
    <div className="relative w-full h-full">
      {children}
      
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 overflow-hidden rounded-inherit"
            style={{ borderRadius: 'inherit' }}
          >
            {/* The Membrane */}
            <div className="absolute inset-0 backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center">
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/microbial-mat.png')]" />
              
              {/* Splitting halves when melting */}
              <motion.div
                animate={isMelting ? { x: '-100%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeIn' }}
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-purple-500/10 to-transparent border-r border-purple-500/30 backdrop-blur-lg"
              />
              <motion.div
                animate={isMelting ? { x: '100%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeIn' }}
                className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-purple-500/10 to-transparent border-l border-purple-500/30 backdrop-blur-lg"
              />

              {!isMelting && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleUnlock}
                  className="relative z-10 p-6 rounded-full bg-purple-900/40 border border-purple-500/50 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col items-center gap-2"
                >
                  <Fingerprint className="w-10 h-10 animate-pulse" />
                  <span className="font-mono text-xs tracking-widest uppercase">Biometric Lock</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
