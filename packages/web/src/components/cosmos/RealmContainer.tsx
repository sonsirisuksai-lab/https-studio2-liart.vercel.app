// packages/web/src/components/cosmos/RealmContainer.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRealm } from '@/lib/RealmContext';
import { useDevice } from '@/hooks/useDevice';
import { COSMOS_SPRING } from '@/lib/motion';

interface RealmContainerProps {
  children: React.ReactNode;
  className?: string;
  realmId?: string;
}

export function RealmContainer({ children, className, realmId }: RealmContainerProps) {
  const { realm } = useRealm();
  const prefersReducedMotion = useReducedMotion();
  const { device } = useDevice();
  
  const config = realm.config3D;

  // Performance check: Disable 3D on low-end devices or if reduced motion is preferred
  const isLowEnd = device?.isIPadMini2 || device?.isIPhoneSE;
  const shouldAnimate3D = !prefersReducedMotion && !isLowEnd;

  const perspectiveStyle = useMemo(() => ({
    perspective: config.perspective,
  }), [config.perspective]);

  return (
    <motion.div
      className={cn(
        'relative w-full overflow-hidden transition-all duration-500 perspective-1000',
        className
      )}
      style={{
        ...perspectiveStyle,
        background: config.backgroundGradient,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 3D Glow Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${config.glowColor}, transparent 70%)`,
        }}
      />

      {/* 3D Content Wrapper with rotation + float */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] md:pt-[2rem] md:pb-[2rem] will-change-transform preserve-3d"
        animate={shouldAnimate3D ? {
          rotateX: config.rotationX,
          rotateY: config.rotationY,
          y: 0,
        } : {
          rotateX: 0,
          rotateY: 0,
          y: 0,
        }}
        transition={shouldAnimate3D ? COSMOS_SPRING : { duration: 0 }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
        }}
      >
        {/* Floating glow orb */}
        {shouldAnimate3D && (
          <motion.div
            animate={{
              y: [0, -config.floatDistance, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + config.animationDelay / 100,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${config.glowColor}40, transparent 70%)`,
            }}
          />
        )}

        {/* Children content */}
        <div className="relative z-20 space-y-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
