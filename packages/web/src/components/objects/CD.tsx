import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface CDProps {
  title: string;
  artist: string;
  cover?: string;
  onPlay?: () => void;
  className?: string;
}

export function CD({ title, artist, cover, onPlay, className }: CDProps) {
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
      whileHover={{ y: -6, rotateY: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggle}
      className={cn('relative w-40 cursor-pointer group', className)}
    >
      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
        className="relative w-40 h-40 rounded-full shadow-xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a1a2e, #0a0a0a)',
          border: '2px solid rgba(255,255,255,0.06)',
          boxShadow: isPlaying ? '0 0 60px rgba(139,92,246,0.15)' : '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* CD Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/10" />
        </div>
        {/* Tracks */}
        <div className="absolute inset-0 rounded-full border border-white/5 mx-6 my-6" />
        <div className="absolute inset-0 rounded-full border border-white/3 mx-12 my-12" />

        {/* Cover Art (center) */}
        {cover && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10">
              <img src={cover} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </motion.div>

      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-white/90 truncate">{title}</div>
        <div className="text-xs text-white/40 truncate">{artist}</div>
        <div className="mt-1 text-[10px] text-white/20">
          {isPlaying ? '▶ Playing' : '⏸ Paused'}
        </div>
      </div>
    </motion.div>
  );
}
