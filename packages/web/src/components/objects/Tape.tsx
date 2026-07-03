import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface TapeProps {
  title: string;
  date: string;
  duration?: string;
  onPlay?: () => void;
  className?: string;
}

export function Tape({ title, date, duration = '00:00', onPlay, className }: TapeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const { playClick, playVinylDrop } = useSound();

  const handlePlay = () => {
    if (isRewinding) return;
    if (!isPlaying) playVinylDrop();
    else playClick();
    setIsPlaying(!isPlaying);
    if (!isPlaying) onPlay?.();
  };

  const handleRewind = () => {
    if (isPlaying) return;
    playClick();
    setIsRewinding(!isRewinding);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn('relative w-44 cursor-pointer group', className)}
    >
      <div className="p-3 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        {/* Tape Body */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {/* Tape Window */}
            <div className="bg-white/5 rounded p-1.5">
              <div className="flex justify-between">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  className="w-4 h-4 rounded-full border border-white/20"
                />
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  className="w-4 h-4 rounded-full border border-white/20"
                />
              </div>
              {/* Tape track */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                {isPlaying && (
                  <motion.div
                    className="h-full bg-amber-400/50 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={handleRewind}
            className={`p-1 rounded-full transition-all text-xs ${
              isRewinding
                ? 'bg-amber-500/20 text-amber-400'
                : isPlaying
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            ⏪
          </button>
          <button
            onClick={handlePlay}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/60 hover:text-white"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-white/80 truncate">{title}</div>
        <div className="text-[10px] text-white/30">{date} · {duration}</div>
      </div>
    </motion.div>
  );
}
