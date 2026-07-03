import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Printer as PrinterIcon } from 'lucide-react';

interface PrinterProps {
  title: string;
  content: string;
  onPrint?: () => void;
  className?: string;
}

export function Printer({ title, content, onPrint, className }: PrinterProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedContent, setPrintedContent] = useState('');
  const { playClick, playVinylDrop } = useSound();

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    setPrintedContent('');
    playVinylDrop();

    const lines = content.split('\n');
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setPrintedContent(prev => prev + (prev ? '\n' : '') + lines[index]);
        playClick();
        index++;
      } else {
        clearInterval(interval);
        setIsPrinting(false);
        onPrint?.();
      }
    }, 150);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn('relative w-52 cursor-pointer group', className)}
    >
      <div className="p-4 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <PrinterIcon className="w-4 h-4 text-white/40" />
            <span className="text-xs font-medium text-white/60">{title}</span>
          </div>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all",
              isPrinting
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            )}
          >
            {isPrinting ? 'Printing...' : '🖨️ Print'}
          </button>
        </div>

        <div className="min-h-[60px] rounded bg-[var(--theme-background)] border border-[var(--theme-border)] p-2">
          <pre className="text-[10px] font-mono text-white/50 whitespace-pre-wrap leading-relaxed">
            {printedContent || (
              <span className="text-white/20">Click Print to generate document</span>
            )}
          </pre>
        </div>

        {/* Paper feed animation */}
        {isPrinting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
          />
        )}
      </div>
    </motion.div>
  );
}
