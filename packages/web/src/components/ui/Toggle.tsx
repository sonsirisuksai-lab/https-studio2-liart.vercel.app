import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, disabled = false, label, className }: ToggleProps) {
  return (
    <label className={cn(
      'inline-flex items-center gap-3 cursor-pointer select-none',
      disabled && 'opacity-40 cursor-not-allowed',
      className
    )}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <motion.div
          className={cn(
            'w-12 h-6 rounded-full transition-colors duration-300',
            checked ? 'bg-[var(--theme-primary)]' : 'bg-white/10 border border-white/10'
          )}
        >
          <motion.div
            className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-md"
            animate={{ x: checked ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
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
