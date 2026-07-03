import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface CassetteProps {
  title: string;
  label: string;
  color?: string;
  onInsert?: () => void;
  className?: string;
}

export function Cassette({ title, label, color = '#1a1a2e', onInsert, className }: CassetteProps) {
  const [isInserted, setIsInserted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playClick, playVinylDrop } = useSound();

  const handleInsert = () => {
    if (!isInserted) {
      playVinylDrop();
      setIsInserted(true);
      onInsert?.();
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInserted) return;
    playClick();
    setIsPlaying(!isPlaying);
  };

  const handleEject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInserted) return;
    playClick();
    setIsInserted(false);
    setIsPlaying(false);
  };

  return (
    <motion.div
      whileHover={{ y: -4, rotateX: 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleInsert}
      className={cn('relative w-36 cursor-pointer group', className)}
    >
      <div
        className="relative p-3 rounded-lg"
        style={{
          background: `linear-gradient(145deg, ${color}, ${color}dd)`,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Cassette Window */}
        <div className="bg-white/5 rounded p-2">
          <div className="w-full h-8 rounded bg-white/10 flex items-center justify-center overflow-hidden">
            {/* Tape reels */}
            {isInserted && (
              <motion.div
                className="flex gap-3"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: isPlaying ? 1 : 0, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-3 h-3 rounded-full border border-white/20" />
                <div className="w-3 h-3 rounded-full border border-white/20" />
              </motion.div>
            )}
            {!isInserted && (
              <span className="text-[8px] text-white/20">📼 TAPE</span>
            )}
          </div>
          <div className="flex justify-between mt-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Tape Track */}
        <div className="absolute inset-x-4 bottom-8 h-0.5 bg-black/30 rounded-full overflow-hidden">
          {isInserted && isPlaying && (
            <motion.div
              className="h-full bg-amber-400/50"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>

        {/* Controls overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isInserted ? (
            <div className="flex gap-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
              <button
                onClick={handlePlay}
                className="p-1.5 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={handleEject}
                className="p-1.5 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-red-400"
              >
                ⏏
              </button>
            </div>
          ) : (
            <div className="text-xs text-white/30 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
              Click to insert
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-white/80 truncate">{title}</div>
        <div className="text-[10px] text-white/30 truncate">{label}</div>
        {isInserted && (
          <span className="text-[8px] text-green-400/50">{isPlaying ? '▶ Playing' : '⏸ Paused'}</span>
        )}
      </div>
    </motion.div>
  );
}
