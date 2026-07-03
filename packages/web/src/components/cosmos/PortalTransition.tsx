import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';

export const PortalTransition = () => {
  const { isTransitioning, realm } = useRealm();

  const renderTransitionEffect = () => {
    switch (realm.id) {
      case 'cyber-neon':
        return (
          <>
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: [0, 1, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 0.8, ease: 'linear' }}
              className="absolute left-0 right-0 h-4 bg-[#00f0ff] shadow-[0_0_100px_#ff007f] z-[210] origin-center"
            />
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: (Math.random() - 0.5) * 1000, 
                  y: (Math.random() - 0.5) * 1000 
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute w-2 h-2 bg-[#ff007f] rounded-full shadow-[0_0_20px_#00f0ff]"
              />
            ))}
          </>
        );
      case 'ironman-nano':
        return (
          <div className="grid grid-cols-10 grid-rows-10 w-full h-full absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0, rotateX: 90 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.6, delay: (i % 10) * 0.05 + Math.floor(i / 10) * 0.05, ease: 'circOut' }}
                className="w-full h-full bg-[#f97316]/20 border border-[#f97316]/50"
              />
            ))}
          </div>
        );
      case 'venom-liquid':
        return (
          <>
            <motion.div
              initial={{ y: '-100%', borderRadius: '50%' }}
              animate={{ y: 0, borderRadius: '0%' }}
              transition={{ duration: 0.8, ease: 'circIn' }}
              className="absolute top-0 left-0 right-0 h-[120vh] bg-black z-[210]"
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '-100vh' }}
                animate={{ y: '20vh' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeIn' }}
                className="absolute top-0 w-32 h-[80vh] bg-black rounded-b-full blur-[10px]"
                style={{ left: `${i * 15}%` }}
              />
            ))}
          </>
        );
      case 'retro-tape':
        return (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="absolute inset-0 bg-black/90 flex flex-col justify-between"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-full h-[2px] bg-[#22c55e]/20" />
            ))}
          </motion.div>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {renderTransitionEffect()}

          {/* Realm Name Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute text-center z-[220]"
          >
             <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80 mb-2 drop-shadow-md">
               Initializing Realm
             </div>
             <div className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
               {realm.name}
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
