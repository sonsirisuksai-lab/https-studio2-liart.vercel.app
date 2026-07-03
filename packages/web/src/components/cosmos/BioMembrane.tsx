import React from 'react';
import { motion } from 'framer-motion';

export const BioMembrane: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-[40px]">
      <motion.div
        animate={{
          scale: [1, 1.05, 1.1, 1.05, 1],
          opacity: [0.2, 0.4, 0.6, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/20 to-transparent blur-3xl"
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
    </div>
  );
};
