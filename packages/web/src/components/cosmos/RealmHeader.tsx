// packages/web/src/components/cosmos/RealmHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { Icon, IconName } from '@/components/ui/Icon';

interface RealmHeaderProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  className?: string;
  glowColor?: string;
}

export function RealmHeader({ icon, title, subtitle, className, glowColor = 'rgba(139,92,246,0.2)' }: RealmHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <motion.div
      className={cn('relative flex items-start gap-6 mb-10', className)}
      animate={shouldAnimate ? {
        y: [0, -4, 0],
        rotateX: [0, 1, 0],
      } : {
        y: 0,
        rotateX: 0,
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 3D Icon Container */}
      <motion.div
        className="relative flex-shrink-0 will-change-transform"
        whileHover={shouldAnimate ? {
          rotateY: 180,
          scale: 1.1,
          transition: { type: 'spring', damping: 20, stiffness: 300 },
        } : {}}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '600px',
        }}
      >
        <div
          className="w-20 h-20 rounded-[28px] glass-medium flex items-center justify-center shadow-xl border-white/10"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${glowColor}, transparent)`,
          }}
        >
          <Icon name={icon} size="xl" className="text-white" />
        </div>
        
        {/* Glow ring behind icon */}
        <div
          className="absolute inset-0 rounded-[28px] blur-2xl -z-10"
          style={{
            background: glowColor,
            opacity: 0.4,
          }}
        />
      </motion.div>

      {/* Text Content */}
      <div className="pt-2">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
          {title}
        </h1>
        {subtitle && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
