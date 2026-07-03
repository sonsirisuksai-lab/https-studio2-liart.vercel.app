import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Glass3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
  glow?: boolean;
  intensity?: string;
}

export const Glass3D: React.FC<Glass3DProps> = ({ children, className, onClick, glowColor, glow, intensity }) => {
  return (
    <motion.div
      initial={{ rotateX: 0, rotateY: 0 }}
      whileHover={{ 
        rotateX: 2, 
        rotateY: 2,
        boxShadow: glow ? `0 20px 40px ${glowColor || 'var(--theme-glow)'}` : '0 20px 40px rgba(0,0,0,0.1)' 
      }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl shadow-[var(--glass-shine)] transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const Glass: React.FC<Glass3DProps> = ({ children, className }) => {
  return (
    <div className={cn('rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl shadow-[var(--glass-shine)]', className)}>
      {children}
    </div>
  );
};
