import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NotebookProps {
  title: string;
  pages: string[];
  onPageFlip?: (page: number) => void;
  className?: string;
}

export function Notebook({ title, pages, onPageFlip, className }: NotebookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const { playFlip } = useSound();

  const handleFlip = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    setIsFlipping(true);
    playFlip();

    if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      onPageFlip?.(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      onPageFlip?.(currentPage - 1);
    }

    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn('relative w-48 cursor-pointer group', className)}
    >
      <div className="p-4 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/60">📓 {title}</span>
          <span className="text-[10px] text-white/20">{currentPage + 1}/{pages.length}</span>
        </div>

        <div className="min-h-[80px] rounded bg-[var(--theme-background)] border border-[var(--theme-border)] p-3 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ rotateY: 10, opacity: 0.8 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">
                {pages[currentPage] || 'Empty page...'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Notebook lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[1px] bg-white/10" style={{ top: `${i * 16 + 40}px` }} />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => handleFlip('prev')}
            disabled={currentPage === 0 || isFlipping}
            className="p-1 rounded hover:bg-white/10 transition-all text-white/30 disabled:opacity-30"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <div className="flex gap-1">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === currentPage || isFlipping) return;
                  playFlip();
                  setCurrentPage(i);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentPage ? 'bg-white/40' : 'bg-white/10'
                )}
              />
            ))}
          </div>
          <button
            onClick={() => handleFlip('next')}
            disabled={currentPage === pages.length - 1 || isFlipping}
            className="p-1 rounded hover:bg-white/10 transition-all text-white/30 disabled:opacity-30"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
