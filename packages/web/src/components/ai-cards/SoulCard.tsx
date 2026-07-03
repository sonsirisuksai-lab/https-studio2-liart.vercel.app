import { useState } from 'react';
import { motion } from 'framer-motion';
import { audioEngine } from '@/lib/audio-engine';
import { ChevronRight, Zap, Brain, Heart, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import { useDevice } from '@/hooks/useDevice';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SoulCardProps {
  id: string;
  name: string;
  title: string;
  icon: string;
  color: string;
  level: number;
  energy: number;
  memory: number;
  ability: string;
  personality: string;
  systemPrompt: string;
  onSelect?: (id: string) => void;
}

export function SoulCard({
  id,
  name,
  title,
  icon,
  color,
  level,
  energy,
  memory,
  ability,
  personality,
  systemPrompt,
  onSelect,
}: SoulCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { device } = useDevice();
  const prefersReducedMotion = useReducedMotion();
  const { playFlip, playVinylDrop } = useSound();

  // Responsive sizing
  const getWidth = () => {
    if (!device) return 256; // 64 * 4
    if (device.isIPhoneSE) return 180;
    if (device.isIPhone6_7_8) return 200;
    if (device.isIPhone12_13_14_15) return 220;
    if (device.isIPhoneMax_Plus) return 240;
    if (device.isIPadMini) return 260;
    if (device.isIPad11) return 300;
    if (device.isIPad12_9) return 340;
    return 256;
  };

  const width = getWidth();
  const height = width * 1.5;

  const handleFlip = () => {
    playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleSelect = () => {
    playVinylDrop();
    onSelect?.(id);
  };

  // Disable animations on legacy devices or if user prefers reduced motion
  const shouldAnimate = !device?.isIPadMini2 && !prefersReducedMotion;
  
  const cardFlipSpring = {
    type: 'spring',
    damping: 15,
    stiffness: 180,
    mass: 0.8,
    duration: shouldAnimate ? undefined : 0,
  };

  const isMobile = device?.isIPhone || (device?.width ?? 0) < 768;

  return (
    <motion.div
      className="relative cursor-pointer group select-none"
      style={{ 
        perspective: '1200px',
        width,
        height
      }}
      whileHover={shouldAnimate ? { y: -12, rotateX: 6, rotateY: -6 } : {}}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={cardFlipSpring}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(18, 18, 36, 0.95), rgba(10, 10, 18, 0.98))`,
            border: `1.5px solid ${color}44`,
            boxShadow: `0 24px 48px -12px ${color}33, inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Holographic Edge Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, transparent 40%, #fbbf24 60%, ${color} 100%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Top Badge Row */}
          <div className="flex justify-between items-center relative z-10">
            <div
              className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
              style={{ background: `${color}33`, color: '#fff', border: `1px solid ${color}44` }}
            >
              LVL {level}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/50 tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              SOUL
            </div>
          </div>

          {/* Hero Avatar / Art */}
          <div className="text-center relative z-10 my-4 flex-1 flex flex-col justify-center">
            <motion.div
              className={cn(
                "mx-auto rounded-full flex items-center justify-center relative shadow-2xl",
                width < 220 ? "w-16 h-16 text-3xl" : "w-24 h-24 text-5xl"
              )}
              style={{ 
                background: `radial-gradient(circle, ${color}55 0%, ${color}11 100%)`, 
                border: `2px solid ${color}77` 
              }}
              whileHover={shouldAnimate ? { scale: 1.05 } : {}}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
              {icon}
            </motion.div>
            <h3 className={cn("mt-4 font-black text-white tracking-wide uppercase", width < 220 ? "text-base" : "text-xl")}>{name}</h3>
            <p className="text-[10px] text-white/60 font-medium tracking-wide mt-0.5">{title}</p>
          </div>

          {/* Stats Segment */}
          <div className="space-y-2 relative z-10 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-md">
            {/* Energy */}
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${energy}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-yellow-400">{energy}%</span>
            </div>

            {/* Cognitive Memory */}
            <div className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${memory}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400">{memory}%</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-white/30 tracking-wider font-semibold uppercase mt-3 animate-pulse">
            TAP TO REVEAL SOUL INFO
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #09090b 0%, #161625 100%)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Decorative Back grid */}
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

          {/* System prompt sectioning */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex-1 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">System Prompt</span>
            </div>
            <p className={cn("text-white/60 leading-relaxed font-mono", width < 220 ? "text-[10px] line-clamp-4" : "text-xs line-clamp-6")}>
              {systemPrompt}
            </p>
          </div>

          {/* Character personality description */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Personality</span>
            </div>
            <p className="text-xs text-white/70 italic leading-snug">"{personality}"</p>
            {width >= 240 && (
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-white/40 font-semibold uppercase tracking-wider">Ability:</span>
                <span className="text-[var(--theme-primary)] font-bold uppercase tracking-wide bg-[var(--theme-primary)]/10 px-2 py-0.5 rounded">
                  {ability}
                </span>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-white/30 tracking-wider font-semibold uppercase mt-3">
            TAP TO ROTATE BACK
          </div>
        </div>
      </motion.div>

      {/* Select Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleSelect();
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={shouldAnimate ? { scale: 1.05 } : {}}
        whileTap={{ scale: 0.95 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-[10px] font-bold text-white shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 whitespace-nowrap"
        style={{ 
          background: `linear-gradient(to right, ${color}cc, ${color}88)`, 
          border: `1.5px solid ${color}`,
          boxShadow: `0 8px 24px ${color}44`,
          minHeight: '44px'
        }}
      >
        <ChevronRight className="w-3.5 h-3.5" /> SELECT AGENT
      </motion.button>
    </motion.div>
  );
}
