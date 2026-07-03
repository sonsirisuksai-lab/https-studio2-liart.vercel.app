import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const MatrixOverlay: React.FC = () => {
  const columns = useMemo(() => {
    const durations = [3.2, 4.5, 2.8, 5.1, 3.9, 4.2, 2.5, 5.8, 3.4, 4.7, 2.1, 5.5, 3.8, 4.3, 2.6, 5.9, 3.1, 4.4, 2.7, 5.2];
    const delays = [0.2, 1.5, 0.8, 1.1, 0.9, 1.2, 0.5, 1.8, 0.4, 1.7, 0.1, 1.5, 0.8, 1.3, 0.6, 1.9, 0.1, 1.4, 0.7, 1.2];
    
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${i * 5}%`,
      duration: durations[i % durations.length],
      delay: delays[i % delays.length]
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden opacity-20">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          initial={{ y: '-100%' }}
          animate={{
            y: '100%',
            opacity: [0.1, 0.3, 0.05, 0.4, 0.2],
          }}
          transition={{
            duration: col.duration,
            repeat: Infinity,
            delay: col.delay,
            ease: "linear"
          }}
          className="absolute top-0 w-px h-64 bg-gradient-to-b from-transparent via-[var(--theme-primary)] to-transparent"
          style={{ left: col.left }}
        />
      ))}
    </div>
  );
};
