import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RadioProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Radio({ checked, onChange, disabled = false, label, className }: RadioProps) {
  return (
    <label className={cn(
      'inline-flex items-center gap-3 cursor-pointer select-none',
      disabled && 'opacity-40 cursor-not-allowed',
      className
    )}>
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={() => !disabled && onChange()}
          className="sr-only"
          disabled={disabled}
        />
        <motion.div
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
            checked 
              ? 'border-[var(--theme-primary)] text-[var(--theme-primary)]' 
              : 'border-[var(--theme-border)] bg-white/5 hover:border-white/20'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {checked && (
            <motion.div
              layoutId="radio-dot"
              className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      </div>
      {label && (
        <span className="text-sm font-medium text-[var(--theme-text)]">
          {label}
        </span>
      )}
    </label>
  );
}
