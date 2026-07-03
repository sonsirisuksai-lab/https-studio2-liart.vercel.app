// packages/web/src/components/ui/Stagger.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

export function Stagger({ children, className, delay = 0, staggerChildren = 0.06 }: StaggerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren, 
        delayChildren: delay 
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
