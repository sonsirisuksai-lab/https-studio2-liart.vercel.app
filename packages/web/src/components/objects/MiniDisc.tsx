import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface MiniDiscProps {
  title: string;
  artist: string;
  onPlay?: () => void;
  className?: string;
}

export function MiniDisc({ title, artist, onPlay, className }: MiniDiscProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playClick, playVinylDrop } = useSound();

  const handleToggle = () => {
    if (!isPlaying) playVinylDrop();
    else playClick();
    setIsPlaying(!isPlaying);
    if (!isPlaying) onPlay?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggle}
      className={cn('relative w-32 cursor-pointer group', className)}
    >
      <div className="relative p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl">💿</div>
            <div className="text-[8px] text-white/30 mt-1">MINIDISC</div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            {isPlaying ? '⏸' : '▶'}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-white/80 truncate">{title}</div>
        <div className="text-[10px] text-white/30 truncate">{artist}</div>
      </div>
    </motion.div>
  );
}
