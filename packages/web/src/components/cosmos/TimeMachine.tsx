// packages/web/src/components/cosmos/TimeMachine.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  icon: string;
  type: 'create' | 'edit' | 'delete' | 'play' | 'export' | 'sync';
}

const MOCK_EVENTS: TimelineEvent[] = [
  { id: '1', time: '2026-07-03 10:00', title: 'Created Vinyl', icon: '🎵', type: 'create' },
  { id: '2', time: '2026-07-03 10:30', title: 'Added Soul Card', icon: '🃏', type: 'create' },
  { id: '3', time: '2026-07-03 11:00', title: 'Printed Document', icon: '📄', type: 'export' },
  { id: '4', time: '2026-07-03 11:30', title: 'Generated DNA', icon: '🧬', type: 'create' },
  { id: '5', time: '2026-07-03 12:00', title: 'Played Vinyl', icon: '🎵', type: 'play' },
  { id: '6', time: '2026-07-03 12:30', title: 'Brain Connected', icon: '🧠', type: 'edit' },
  { id: '7', time: '2026-07-03 13:00', title: 'Typed Markdown', icon: '⌨️', type: 'create' },
  { id: '8', time: '2026-07-03 13:30', title: 'Exported Data', icon: '💾', type: 'export' },
  { id: '9', time: '2026-07-03 14:00', title: 'Synced to Cloud', icon: '☁️', type: 'sync' },
  { id: '10', time: '2026-07-03 14:30', title: 'Deleted Draft', icon: '🗑️', type: 'delete' },
];

export function TimeMachine() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { playClick, playFlip } = useSound();

  const currentEvent = MOCK_EVENTS[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && currentIndex < MOCK_EVENTS.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => Math.min(prev + 1, MOCK_EVENTS.length - 1));
      }, 1500);
    } else if (isPlaying && currentIndex === MOCK_EVENTS.length - 1) {
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, currentIndex]);

  const handleFlip = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    setIsFlipping(true);
    playFlip();
    if (direction === 'next' && currentIndex < MOCK_EVENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    setTimeout(() => setIsFlipping(false), 300);
  };

  const handlePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playClick();
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const progress = useMemo(() => {
    return (currentIndex / (MOCK_EVENTS.length - 1)) * 100;
  }, [currentIndex]);

  return (
    <div className="space-y-[var(--space-4)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--space-2)]">
        <div>
          <span className="text-xs font-bold tracking-widest text-[var(--theme-primary)] uppercase">⏳ Chronicle Time Machine</span>
          <h2 className="text-2xl font-black text-[var(--theme-text)] tracking-tight mt-1">Dimensional History</h2>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1">
            Rewind and replay system events with our high-fidelity film strip visualizer.
          </p>
        </div>
        <div className="flex items-center gap-[var(--space-2)] text-xs font-mono text-[var(--theme-text-tertiary)]">
          <Clock className="w-3.5 h-3.5" />
          {currentIndex + 1} / {MOCK_EVENTS.length}
        </div>
      </div>

      {/* Film Strip View */}
      <div className="p-[var(--space-4)] rounded-2xl bg-[var(--theme-glass)] border border-[var(--theme-border)] shadow-2xl relative overflow-hidden">
        <div className="flex gap-[var(--space-3)] overflow-x-auto py-[var(--space-3)] scrollbar-none snap-x">
          {MOCK_EVENTS.map((event, index) => {
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;
            return (
              <motion.div
                key={event.id}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer transition-all snap-center ${
                  isActive ? 'scale-110' : isPast ? 'opacity-50' : 'opacity-20'
                }`}
                onClick={() => {
                  if (isFlipping) return;
                  playClick();
                  setCurrentIndex(index);
                }}
                animate={{ y: isActive ? -4 : 0 }}
                whileHover={{ scale: isActive ? 1.15 : 1.05 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
                  style={{
                    background: isActive ? 'var(--theme-primary-rgb)' : 'var(--theme-border)',
                    backgroundColor: isActive ? 'rgba(var(--theme-primary-rgb), 0.15)' : 'rgba(128,128,128,0.05)',
                    border: isActive ? '2px solid var(--theme-primary)' : '1px solid var(--theme-border)',
                    boxShadow: isActive ? '0 0 30px rgba(var(--theme-primary-rgb), 0.2)' : 'none',
                  }}
                >
                  {event.icon}
                </div>
                <span className="text-[10px] font-bold text-[var(--theme-text-tertiary)] text-center max-w-[68px] truncate uppercase">
                  {event.title.split(' ')[0]}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Cinematic Film Strip Holes */}
        <div className="absolute top-1 left-0 right-0 h-1.5 flex justify-between px-2 opacity-25">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-2.5 h-1.5 bg-[var(--theme-text)]/40 rounded" />
          ))}
        </div>
        <div className="absolute bottom-1 left-0 right-0 h-1.5 flex justify-between px-2 opacity-25">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-2.5 h-1.5 bg-[var(--theme-text)]/40 rounded" />
          ))}
        </div>

        {/* Progress Slider Bar */}
        <div className="w-full h-1 bg-[var(--theme-border)] rounded-full overflow-hidden mt-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Selected Chronicle Record Card */}
      <AnimatePresence mode="wait">
        {currentEvent && (
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-[var(--space-4)] sm:p-5 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center gap-[var(--space-4)] relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[var(--theme-primary)]/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {currentEvent.icon}
            </span>
            <div>
              <h3 className="text-base font-black text-[var(--theme-text)]">{currentEvent.title}</h3>
              <p className="text-xs text-[var(--theme-text-tertiary)] font-mono mt-1">{currentEvent.time}</p>
            </div>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)]">
              {currentEvent.type}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bridge HUD */}
      <div className="flex justify-center items-center gap-[var(--space-3)] mt-[var(--space-4)]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFlip('prev')}
          disabled={currentIndex === 0 || isFlipping}
          className="p-3 rounded-xl bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] transition-all disabled:opacity-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          className="p-3 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-3 rounded-xl bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFlip('next')}
          disabled={currentIndex === MOCK_EVENTS.length - 1 || isFlipping}
          className="p-3 rounded-xl bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] transition-all disabled:opacity-20"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
