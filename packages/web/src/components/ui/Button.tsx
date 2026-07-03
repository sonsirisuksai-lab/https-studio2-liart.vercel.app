import React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import { useSound } from '@/hooks/useSound';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'icon' | 'floating';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, error, success, className, children, onClick, ...props }, ref) => {
    const { playClick } = useSound();
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      
      if (variant !== 'ghost' && variant !== 'icon') {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 20;
        const id = Date.now();
        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      onClick?.(e);
    };

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white hover:opacity-95 shadow-[0_4px_16px_rgba(var(--theme-primary-rgb),0.25)] hover:shadow-[0_4px_24px_rgba(var(--theme-primary-rgb),0.4)] border border-transparent transition-all',
      secondary: 'glass-medium text-[var(--theme-text)] hover:bg-white/10 hover:border-white/20 shadow-sm transition-all',
      ghost: 'bg-transparent text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-white/5 border border-transparent transition-all',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 shadow-sm transition-all',
      success: 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 shadow-sm transition-all',
      icon: 'p-3 rounded-full glass-light hover:glass-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] flex items-center justify-center aspect-square transition-all',
      floating: 'p-4 rounded-full shadow-[0_12px_32px_rgba(var(--theme-primary-rgb),0.3)] bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-secondary)] border border-transparent hover:shadow-[0_16px_40px_rgba(var(--theme-primary-rgb),0.45)] transition-all',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs min-h-[44px]',
      md: 'px-4 py-2 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[48px]',
      xl: 'px-8 py-4 text-lg min-h-[52px]',
    };

    const stateStyles = cn(
      loading && 'opacity-60 cursor-wait pointer-events-none',
      disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      error && 'border-red-500 text-red-500',
      success && 'border-green-500 text-green-500',
    );

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 370 }}
        disabled={disabled || loading}
        className={cn(
          'relative rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 overflow-hidden',
          variants[variant],
          sizes[size],
          stateStyles,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{ left: ripple.x, top: ripple.y, width: 40, height: 40 }}
            />
          ))}
        </AnimatePresence>
        {loading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </span>
        ) : null}
        <span className={cn(loading && 'opacity-0', 'flex items-center gap-2 relative z-10')}>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
