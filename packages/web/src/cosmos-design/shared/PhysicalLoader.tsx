import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PhysicalLoader: React.FC<{ active: boolean, type?: 'origami' | 'ink' }> = ({ active, type = 'origami' }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
          {type === 'origami' ? (
            <div className="relative w-64 h-64 flex items-center justify-center">
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 border-2 border-[var(--theme-primary)] origin-bottom-right"
                  initial={{ rotateX: 0, rotateY: 0, rotateZ: i * 90 }}
                  animate={{ 
                    rotateX: [0, 45, 0], 
                    rotateY: [0, 45, 0],
                    rotateZ: i * 90 + 180
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.2 }}
                  style={{ background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.05))' }}
                />
              ))}
              <div className="absolute font-mono text-[var(--theme-primary)] text-sm tracking-widest">
                SYNTHESIZING
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
               {/* Ink Bleeding Effect */}
               <motion.div
                 initial={{ scale: 0, opacity: 0.8 }}
                 animate={{ scale: 10, opacity: 0 }}
                 transition={{ duration: 3, ease: "easeOut" }}
                 className="w-16 h-16 bg-black rounded-full filter blur-xl mix-blend-multiply"
               />
               <div className="absolute font-mono text-white text-sm tracking-widest mix-blend-difference">
                 PROCESSING...
               </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
