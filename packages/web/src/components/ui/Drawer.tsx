// packages/web/src/components/ui/Drawer.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Drawer({ 
  isOpen, 
  onClose, 
  position = 'right', 
  children, 
  className,
  title 
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const positionClasses = {
    left: 'inset-y-0 left-0',
    right: 'inset-y-0 right-0',
    bottom: 'inset-x-0 bottom-0',
  };

  const animationVariants = {
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  };

  const sizeClasses = {
    left: 'max-w-md w-[90vw]',
    right: 'max-w-md w-[90vw]',
    bottom: 'max-h-[85vh] h-auto rounded-t-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — z-index: 700 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer — z-index: 800 */}
          <motion.div
            initial={animationVariants[position].initial}
            animate={animationVariants[position].animate}
            exit={animationVariants[position].exit}
            className={cn(
              'fixed z-[var(--z-modal)] flex flex-col',
              positionClasses[position],
              sizeClasses[position]
            )}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
          >
            <Glass
              depth="modal"
              blur={40}
              opacity={0.15}
              className={cn(
                'h-full flex flex-col',
                position === 'bottom' ? 'rounded-t-3xl' : 'rounded-none',
                className
              )}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {children}
              </div>
            </Glass>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
