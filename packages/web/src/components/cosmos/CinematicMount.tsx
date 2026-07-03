import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { engine } from '@/lib/audio-engine';

export const CinematicMount = ({ children, isVisible }: { children: React.ReactNode, isVisible: boolean }) => {
  const { realm } = useRealm();
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger effect, then show children after delay
      engine.playSound(realm.id);
      const timer = setTimeout(() => setShowChildren(true), 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowChildren(false), 0);
    }
  }, [isVisible, realm.id]);

  const renderEffect = () => {
    if (!isVisible && !showChildren) return null;
    
    switch (realm.id) {
      case 'retro-tape':
        return (
          <motion.div
            initial={{ height: 0, opacity: 1 }}
            animate={showChildren ? { height: 0, opacity: 0 } : { height: '100%', opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
            className="absolute inset-0 z-50 bg-[#1a1a1a] flex flex-col justify-center items-center overflow-hidden border-y-4 border-[#22c55e]"
          >
            {/* Cassette Deck Mechanism */}
            <div className="flex gap-12 items-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-[6px] border-dashed border-[#22c55e] rounded-full flex items-center justify-center"
              >
                <div className="w-8 h-8 border-[4px] border-[#22c55e] rounded-full" />
              </motion.div>
              <div className="h-4 w-32 bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent" />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-[6px] border-dashed border-[#22c55e] rounded-full flex items-center justify-center"
              >
                <div className="w-8 h-8 border-[4px] border-[#22c55e] rounded-full" />
              </motion.div>
            </div>
            {/* CRT Scanline */}
            <motion.div 
              animate={{ y: ['-100%', '1000%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 right-0 h-2 bg-white/20 mix-blend-overlay"
            />
          </motion.div>
        );

      case 'cyber-neon':
        return (
          <motion.div
            initial={{ clipPath: 'inset(50% 50% 50% 50%)', opacity: 1 }}
            animate={showChildren ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0 } : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ duration: 0.5, ease: 'circOut' }}
            className="absolute inset-0 z-50 pointer-events-none"
          >
            {/* Laser Grid sweep */}
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 0.5, ease: 'linear' }}
              className="absolute left-0 right-0 h-4 bg-[#00f0ff] shadow-[0_0_50px_#00f0ff,0_0_100px_#ff007f] z-50"
            />
            {/* Exploding sparks */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: '50%', y: '50%' }}
                animate={showChildren ? { 
                  opacity: 0, 
                  scale: 0, 
                  x: `${50 + (Math.random() - 0.5) * 150}%`, 
                  y: `${50 + (Math.random() - 0.5) * 150}%` 
                } : { opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: Math.random() > 0.5 ? '#00f0ff' : '#ff007f', boxShadow: `0 0 10px ${Math.random() > 0.5 ? '#00f0ff' : '#ff007f'}` }}
              />
            ))}
          </motion.div>
        );

      case 'ironman-nano':
        return (
          <motion.div
            initial={{ opacity: 1 }}
            animate={showChildren ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 bg-[#111] overflow-hidden flex items-center justify-center pointer-events-none"
          >
            {/* Hexagonal Tech-grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBvbHlnb24gcG9pbnRzPSIxMCwwIDIwLDUgMjAsMTUgMTAsMjAgMCwxNSAwLDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30" />
            
            {/* Micro-fragments assembling */}
            <div className="relative w-full h-full flex flex-wrap">
              {!showChildren && Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0, x: (Math.random() - 0.5) * 500, y: (Math.random() - 0.5) * 500 }}
                  animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.random() * 0.3, ease: 'circOut' }}
                  className="w-[10%] h-[10%] bg-[#f97316]/20 border border-[#f97316]/50"
                />
              ))}
            </div>
            
            {/* Pulsating Arc Reactor */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute w-32 h-32 rounded-full border-[4px] border-[#3b82f6] shadow-[0_0_50px_#3b82f6,inset_0_0_50px_#3b82f6] flex items-center justify-center bg-[#1e3a8a]/40 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_30px_#fff]" />
            </motion.div>
          </motion.div>
        );

      case 'venom-liquid':
        return (
          <motion.div
            initial={{ opacity: 1 }}
            animate={showChildren ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
          >
            {/* Tendrils from edges */}
            {!showChildren && Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const isVertical = Math.abs(Math.sin(angle)) > Math.abs(Math.cos(angle));
              return (
                <motion.div
                  key={i}
                  initial={isVertical ? { scaleY: 0, originY: angle > Math.PI ? 1 : 0 } : { scaleX: 0, originX: angle > Math.PI/2 && angle < 3*Math.PI/2 ? 1 : 0 }}
                  animate={isVertical ? { scaleY: 1.5 } : { scaleX: 1.5 }}
                  transition={{ duration: 0.6, delay: Math.random() * 0.2, ease: 'circIn' }}
                  className="absolute bg-black blur-[4px]"
                  style={{
                    top: isVertical ? (angle > Math.PI ? 'auto' : 0) : `${50 + Math.sin(angle)*50}%`,
                    bottom: isVertical ? (angle > Math.PI ? 0 : 'auto') : 'auto',
                    left: !isVertical ? (angle > Math.PI/2 && angle < 3*Math.PI/2 ? 'auto' : 0) : `${50 + Math.cos(angle)*50}%`,
                    right: !isVertical ? (angle > Math.PI/2 && angle < 3*Math.PI/2 ? 0 : 'auto') : 'auto',
                    width: isVertical ? '40px' : '100%',
                    height: isVertical ? '100%' : '40px',
                    borderRadius: '20px'
                  }}
                />
              );
            })}
            {/* Central Splash */}
            <motion.div
              initial={{ scale: 0, opacity: 0, borderRadius: '100%' }}
              animate={!showChildren ? { scale: [0, 5], opacity: [0, 1], borderRadius: ['100%', '0%'] } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeIn' }}
              className="absolute inset-0 bg-black m-auto w-32 h-32 origin-center"
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {!showChildren && isVisible && (
          <motion.div exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            {renderEffect()}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showChildren ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
