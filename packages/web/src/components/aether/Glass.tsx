import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealm } from '@/lib/RealmContext';

type GlassDepth = 'base' | 'raised' | 'floating' | 'modal' | 'toast';

interface GlassProps {
  depth?: GlassDepth;
  blur?: 8 | 16 | 24 | 30 | 40 | 50;
  opacity?: number;
  border?: boolean;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  animateMount?: boolean;
}

const depthMap: Record<GlassDepth, string> = {
  base: 'z-[var(--z-base)]',
  raised: 'z-[var(--z-content)]',
  floating: 'z-[var(--z-popover)]',
  modal: 'z-[var(--z-modal)]',
  toast: 'z-[var(--z-toast)]',
};

const shadowMap: Record<GlassDepth, string> = {
  base: 'shadow-none',
  raised: 'shadow-[0_4px_16px_rgba(0,0,0,0.1)]',
  floating: 'shadow-[0_8px_32px_rgba(0,0,0,0.2)]',
  modal: 'shadow-[0_16px_48px_rgba(0,0,0,0.3)]',
  toast: 'shadow-[0_8px_24px_rgba(0,0,0,0.2)]',
};

export function Glass({
  depth = 'base',
  blur = 40,
  opacity = 0.07,
  border = true,
  glow = false,
  className,
  style,
  children,
  onClick,
  animateMount = false,
}: GlassProps) {
  const { getMountAnimation } = useRealm();
  
  const mountProps = animateMount 
    ? {
        variants: getMountAnimation(),
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: { type: 'spring', damping: 20, stiffness: 100 }
      } 
    : {};

  return (
    <motion.div
      {...mountProps}
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all relative',
        depthMap[depth],
        shadowMap[depth],
        border && 'border border-[var(--glass-border)]',
        glow && 'shadow-[0_0_40px_var(--theme-glow)]',
        className
      )}
      style={{
        background: `rgba(var(--glass-rgb, 255, 255, 255), ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {/* Top-edge highlight for realism */}
      {border && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-accent)]/20 to-transparent" />
        </div>
      )}
      {children}
    </motion.div>
  );
}
