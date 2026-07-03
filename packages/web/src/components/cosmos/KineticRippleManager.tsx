import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { engine } from '@/lib/audio-engine';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const KineticRippleManager = () => {
  const { realm } = useRealm();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks that are not on interactive elements if we want to be picky, 
      // but the prompt says "whenever any button, layout expander, or Realm navigation link is triggered".
      // A simple heuristic is checking if it's a button, a link, or has a pointer cursor.
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button') || target.closest('a') || window.getComputedStyle(target).cursor === 'pointer';
      
      if (isInteractive) {
        const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
        engine.enable();
        engine.playSound(realm.id);
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1500);
      }
    };

    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, [realm.id]);

  const getRippleProps = () => {
    switch (realm.id) {
      case 'cyber-neon':
        return {
          // Laser-instant
          transition: { duration: 0.3, ease: 'easeOut' },
          style: { border: '2px solid #00f0ff', boxShadow: '0 0 20px #00f0ff', borderRadius: '50%' }
        };
      case 'ironman-nano':
        return {
          // Micro-assembly ticks
          transition: { duration: 0.6, type: 'spring', stiffness: 400, damping: 20 },
          style: { border: '1px dashed #f97316', borderRadius: '10%' }
        };
      case 'venom-liquid':
        return {
          // Viscous slow drag
          transition: { duration: 1.2, ease: 'circOut' },
          style: { background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, transparent 70%)', filter: 'blur(5px)', borderRadius: '50%' }
        };
      case 'retro-tape':
        return {
          // Structural stutter
          transition: { duration: 0.5, ease: 'steps(5)' },
          style: { border: '4px solid #22c55e', borderRadius: '0%' }
        };
      default:
        return {
          transition: { duration: 0.5, ease: 'easeOut' },
          style: { border: '2px solid var(--theme-primary)', borderRadius: '50%' }
        };
    }
  };

  const { transition, style } = getRippleProps();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32"
            style={{
              left: ripple.x,
              top: ripple.y,
              ...style
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
