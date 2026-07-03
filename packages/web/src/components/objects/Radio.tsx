import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX } from 'lucide-react';

interface RadioProps {
  title: string;
  frequency?: string;
  onPlay?: () => void;
  className?: string;
}

export function Radio({ title, frequency = 'FM 88.5', onPlay, className }: RadioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const { playClick, playVinylDrop } = useSound();

  const handleToggle = () => {
    if (!isPlaying) playVinylDrop();
    else playClick();
    setIsPlaying(!isPlaying);
    if (!isPlaying) onPlay?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn('relative w-44 cursor-pointer group', className)}
    >
      <div className="p-3 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs font-medium text-white/80">{title}</div>
            <div className="text-[10px] text-white/30">{frequency}</div>
          </div>
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/60 hover:text-white"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 mt-2">
          {volume > 0 ? <Volume2 className="w-3 h-3 text-white/30" /> : <VolumeX className="w-3 h-3 text-white/30" />}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-amber-400 h-1 cursor-pointer"
          />
        </div>

        {/* Radio Wave Animation */}
        {isPlaying && (
          <div className="flex justify-center gap-0.5 mt-2 h-6 items-end">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 8 + (i % 3) * 4, 4] }}
                transition={{ duration: 0.5 + i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-amber-400/40 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
