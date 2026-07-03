// src/components/music/Vinyl.tsx
import { motion } from 'framer-motion';
import { audioEngine } from '@/lib/audio-engine';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import { useDevice } from '@/hooks/useDevice';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface VinylProps {
  title: string;
  artist: string;
  cover: string;
  isPlaying?: boolean;
  onToggle?: () => void;
}

export function Vinyl({ title, artist, cover, isPlaying = false, onToggle }: VinylProps) {
  const { device } = useDevice();
  const prefersReducedMotion = useReducedMotion();
  
  // Responsive sizing
  const getSize = () => {
    if (!device) return 180;
    if (device.isIPhoneSE) return 120;
    if (device.isIPhone6_7_8) return 140;
    if (device.isIPhone12_13_14_15) return 160;
    if (device.isIPhoneMax_Plus) return 180;
    if (device.isIPadMini) return 200;
    if (device.isIPad11) return 240;
    if (device.isIPad12_9) return 280;
    return 180;
  };
  
  const size = getSize();
  const isMobile = device?.isIPhone || (device?.width ?? 0) < 768;
  const isTablet = device?.isIPad || (device?.width ?? 0) >= 768;
  
  const { playVinylDrop, playClick } = useSound();

  // Disable animations on legacy devices or if user prefers reduced motion
  const shouldAnimate = !device?.isIPadMini2 && !prefersReducedMotion;
  
  const vinylSpring = {
    type: 'spring',
    damping: 20,
    stiffness: 200,
    duration: shouldAnimate ? undefined : 0,
  };

  const handleToggle = () => {
    if (!isPlaying) {
      playVinylDrop();
    } else {
      playClick();
    }
    onToggle?.();
  };

  return (
    <div className={cn(
      "relative flex select-none",
      isMobile ? "flex-col items-center text-center" : "flex-row items-center gap-8 text-left"
    )} style={{ perspective: 1000 }}>
      {/* Needle Drop System - Hidden on small mobile to save space if needed, or scaled */}
      {!isMobile && (
        <motion.div
          initial={{ rotate: -35 }}
          animate={{ rotate: isPlaying ? 5 : -35 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          style={{ originX: 0.9, originY: 0.1 }}
          className="absolute -top-4 -right-1.5 w-16 h-24 z-20 pointer-events-none"
        >
          <svg className="w-full h-full text-zinc-300 drop-shadow-md" viewBox="0 0 60 100" fill="none">
            <circle cx="50" cy="15" r="8" fill="url(#pivotGrad)" />
            <circle cx="50" cy="15" r="4" fill="#18181b" />
            <path d="M 50 15 L 20 45 L 20 85" stroke="url(#metallic)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 16 82 L 24 82 L 22 92 L 14 92 Z" fill="#27272a" />
            <rect x="17" y="88" width="4" height="4" fill="#fbbf24" />
            <defs>
              <linearGradient id="pivotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#3f3f46" />
              </linearGradient>
              <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e4e4e7" />
                <stop offset="50%" stopColor="#71717a" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}

      {/* Touch Wrapper for the Record */}
      <div 
        className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer relative"
        onClick={handleToggle}
      >
        <motion.div
          whileHover={shouldAnimate ? { y: -8, rotateX: 8, rotateY: -8 } : {}}
          whileTap={{ scale: 0.96 }}
          style={{ width: size, height: size }}
          className="relative cursor-pointer group"
        >
          {/* Dynamic Shadow */}
          <motion.div
            className="absolute inset-1 bg-black/50 rounded-full blur-xl -z-10"
            animate={shouldAnimate && isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={shouldAnimate && isPlaying ? { repeat: Infinity, duration: 8, ease: 'linear' } : vinylSpring}
          />

          {/* The Vinyl Disk */}
          <motion.div
            animate={shouldAnimate && isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={shouldAnimate && isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : vinylSpring}
            className={cn(
              'w-full h-full rounded-full border border-white/5 relative flex items-center justify-center transition-shadow duration-300',
              isPlaying ? 'shadow-[0_0_50px_rgba(var(--theme-primary-rgb),0.25)]' : 'shadow-2xl'
            )}
            style={{
              background: 'radial-gradient(circle, #27272a 0%, #18181b 40%, #09090b 70%, #020202 100%)',
            }}
          >
            <div className="absolute inset-0 rounded-full border border-white/5 opacity-10 pointer-events-none"
                 style={{ background: 'conic-gradient(from 0deg, transparent 30deg, white 45deg, transparent 60deg, transparent 210deg, white 225deg, transparent 240deg)' }} />

            {/* Label / Cover art */}
            <div className={cn(
              "rounded-full border border-black/40 shadow-inner flex flex-col items-center justify-center p-2 text-center bg-zinc-900 overflow-hidden relative",
              size < 150 ? "w-10 h-10" : "w-20 h-20"
            )}>
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/20 to-[var(--theme-secondary)]/20 opacity-40" />
              {size >= 150 && <Icon name="Disc" size="sm" className="text-[var(--theme-primary)] animate-pulse" />}
              <div className="w-3 h-3 rounded-full bg-zinc-950 border border-white/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] z-10 absolute" />
            </div>
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-full glass-premium flex flex-col items-center justify-center p-4 text-center z-10 border border-white/10"
          >
            <h4 className="text-white text-xs font-bold leading-tight truncate w-full px-2">{title}</h4>
            <div className="mt-3 p-2 rounded-full bg-white/10 border border-white/10 shadow-sm">
              {isPlaying ? <Icon name="Pause" size="sm" className="text-white" /> : <Icon name="Play" size="sm" className="text-white ml-0.5" />}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Info Content */}
      <div className={cn("flex flex-col", isMobile ? "mt-6" : "flex-1")}>
        <h3 className={cn("font-black tracking-tight text-white uppercase", size < 180 ? "text-lg" : "text-3xl")}>
          {title}
        </h3>
        <p className={cn("text-[var(--theme-text-secondary)] font-medium", size < 180 ? "text-xs" : "text-sm")}>
          {artist}
        </p>
        
        {isTablet && (
          <div className="mt-4 flex items-center gap-3">
            <div className="px-3 py-1 rounded-full glass-light border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </div>
            {device?.isIPad12_9 && (
              <span className="text-[10px] text-white/20 uppercase tracking-tighter">Hi-Fi Audio Active</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
