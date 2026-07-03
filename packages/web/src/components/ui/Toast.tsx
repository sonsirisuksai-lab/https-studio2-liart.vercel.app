// packages/web/src/components/ui/Toast.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'border-green-500/30 text-green-400',
  error: 'border-red-500/30 text-red-400',
  info: 'border-blue-500/30 text-blue-400',
  warning: 'border-amber-500/30 text-amber-400',
};

export function Toast({ type, message, onClose }: ToastProps) {
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className="z-[var(--z-toast)]"
    >
      <Glass
        depth="toast"
        blur={40}
        opacity={0.15}
        className={cn(
          'flex items-center gap-4 px-5 py-4 min-w-[320px] max-w-md border-l-4 shadow-2xl',
          colorMap[type]
        )}
      >
        <div className={cn("p-2 rounded-lg bg-white/5", colorMap[type].split(' ')[1])}>
          <Icon className="w-5 h-5 flex-shrink-0" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">
            System Message
          </div>
          <div className="text-sm font-bold text-white leading-snug">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/20 hover:text-white"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </Glass>
    </motion.div>
  );
}
