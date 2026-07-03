// src/components/cookbook/Book.tsx
import { motion } from 'framer-motion';
import { springConfig, soundFx } from '@/lib/physics-sound';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import { useDevice } from '@/hooks/useDevice';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Book({ title, cover, onClick }: { title: string; cover: string; onClick: () => void }) {
  const { device } = useDevice();
  const prefersReducedMotion = useReducedMotion();
  
  // Responsive sizing
  const getWidth = () => {
    if (!device) return 160;
    if (device.isIPhoneSE) return 100;
    if (device.isIPhone6_7_8) return 120;
    if (device.isIPhone12_13_14_15) return 140;
    if (device.isIPhoneMax_Plus) return 150;
    if (device.isIPadMini) return 160;
    if (device.isIPad11) return 200;
    if (device.isIPad12_9) return 240;
    return 160;
  };
  
  const width = getWidth();
  const height = width * 1.4; // Maintain aspect ratio
  
  const isMobile = device?.isIPhone || (device?.width ?? 0) < 768;
  const isTablet = device?.isIPad || (device?.width ?? 0) >= 768;
  
  const { playFlip } = useSound();

  // Disable animations on legacy devices or if user prefers reduced motion
  const shouldAnimate = !device?.isIPadMini2 && !prefersReducedMotion;
  
  const bookSpring = {
    type: 'spring',
    damping: 24,
    stiffness: 180,
    duration: shouldAnimate ? undefined : 0,
  };

  const handleFlip = () => {
    playFlip();
    onClick?.();
  };

  return (
    <div 
      className={cn(
        "relative select-none py-4 px-2 flex",
        isMobile ? "flex-col items-center" : "flex-row items-center gap-6"
      )} 
      style={{ perspective: 1200 }}
    >
      {/* Touch Wrapper / 3D Container */}
      <motion.div
        whileHover={shouldAnimate ? {
          y: -10,
          rotateY: -16,
          rotateX: 6,
          z: 20,
        } : {}}
        whileTap={{ scale: 0.96 }}
        transition={bookSpring}
        onClick={handleFlip}
        className="relative rounded-r-xl cursor-pointer group flex shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)] border-r border-t border-b border-white/5 transition-shadow duration-300"
        style={{
          width,
          height,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Visible Spine */}
        <div
          className="w-5 h-full rounded-l-md flex flex-col justify-between py-4 border-r border-black/30 z-20"
          style={{
            background: 'linear-gradient(to right, #11111e 0%, #1e1e38 40%, #2a2a4e 80%, #16162a 100%)',
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(0,0,0,0.4)',
          }}
        >
          <div className="space-y-10 opacity-40">
            <div className="h-[2px] bg-white/20 border-b border-black/40" />
            <div className="h-[2px] bg-white/20 border-b border-black/40" />
          </div>
          <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest text-center writing-mode-vertical rotate-180 select-none">
            {isMobile ? '' : 'COSMOS'}
          </div>
          <div className="space-y-10 opacity-40">
            <div className="h-[2px] bg-white/20 border-b border-black/40" />
          </div>
        </div>

        {/* Outer Pages stack thickness */}
        <div 
          className="absolute right-0 top-1 bottom-1 w-2 bg-zinc-200 border-l border-zinc-400/20 rounded-r shadow-[inset_1px_0_3px_rgba(0,0,0,0.15)] z-0 pointer-events-none"
          style={{
            transform: 'translateZ(-1px)',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)',
          }}
        />

        {/* Book Cover Container */}
        <div
          className="flex-1 rounded-r-xl p-[var(--space-4)] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e1e38] to-[#121224]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '4px 4px',
          }} />

          {/* Emoji cover art */}
          <div className="relative flex items-center justify-center pt-2">
            <motion.span 
              className={cn("drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]", width < 140 ? "text-3xl" : "text-5xl")}
              animate={shouldAnimate ? { rotate: [0, -2, 2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            >
              {cover}
            </motion.span>
          </div>

          {/* Book Title */}
          <div className="relative z-10 mt-auto">
            <h4 className={cn("font-bold text-white/90 line-clamp-2 uppercase tracking-wide leading-tight", width < 140 ? "text-[10px]" : "text-xs")}>
              {title}
            </h4>
            {width >= 140 && <div className="w-10 h-[3px] bg-gradient-to-r from-amber-500/60 to-transparent mt-2 rounded-full" />}
          </div>
        </div>
      </motion.div>

      {/* Info Content for Tablet/Desktop side layout */}
      {!isMobile && (
        <div className="flex flex-col max-w-xs">
          <h3 className="text-xl font-black text-white uppercase tracking-tight line-clamp-1">{title}</h3>
          <p className="text-sm text-white/40 mt-1 line-clamp-2 leading-relaxed">
            A comprehensive documentation module within the Cosmos Ecosystem.
          </p>
          {device?.isIPad12_9 && (
            <div className="mt-4 p-3 rounded-lg glass-light border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-primary)]">Module Active</span>
              <div className="text-xs text-white/60 mt-1">Full knowledge graph synchronized.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
