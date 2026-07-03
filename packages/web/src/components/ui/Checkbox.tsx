import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, disabled = false, label, className }: CheckboxProps) {
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
            'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
            checked 
              ? 'bg-[var(--theme-primary)] border-[var(--theme-primary)] text-white' 
              : 'border-[var(--theme-border)] bg-white/5 hover:border-white/20'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
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
