import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Play, Square, RotateCcw } from 'lucide-react';

interface TypewriterProps {
  title: string;
  content: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function Typewriter({ title, content, speed = 50, onComplete, className }: TypewriterProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playClick } = useSound();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTyping = () => {
    if (isPlaying) return;
    setDisplayContent('');
    setIsPlaying(true);
    playClick();

    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index < content.length) {
        setDisplayContent(prev => prev + content[index]);
        playClick();
        index++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        onComplete?.();
      }
    }, speed);
  };

  const stopTyping = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const resetTyping = () => {
    stopTyping();
    setDisplayContent('');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn('relative w-52 cursor-pointer group', className)}
    >
      <div className="p-4 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/60">⌨️ {title}</span>
          <div className="flex gap-1">
            <button onClick={startTyping} disabled={isPlaying} className="p-1 rounded hover:bg-white/10 transition-all text-white/40 disabled:opacity-30">
              <Play className="w-3 h-3" />
            </button>
            <button onClick={stopTyping} disabled={!isPlaying} className="p-1 rounded hover:bg-white/10 transition-all text-white/40 disabled:opacity-30">
              <Square className="w-3 h-3" />
            </button>
            <button onClick={resetTyping} className="p-1 rounded hover:bg-white/10 transition-all text-white/40">
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="min-h-[60px] rounded bg-[var(--theme-background)] border border-[var(--theme-border)] p-2">
          <div className="flex items-start gap-1">
            <span className="text-[10px] text-white/20 font-mono">▸</span>
            <pre className="text-[10px] font-mono text-white/50 whitespace-pre-wrap leading-relaxed flex-1">
              {displayContent || <span className="text-white/20">Press play to type...</span>}
            </pre>
          </div>
        </div>

        {isPlaying && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute bottom-6 right-4 w-0.5 h-3 bg-amber-400/50"
          />
        )}
      </div>
    </motion.div>
  );
}
