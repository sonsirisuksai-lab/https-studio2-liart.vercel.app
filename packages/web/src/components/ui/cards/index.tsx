import React, { useMemo } from 'react';
import { mulberry32 } from '../../../cosmos-design/shared/prng';

export { FeatureCard } from './FeatureCard';
export { StatCard } from './StatCard';
export { GlassCard } from './GlassCard';
export { TimelineCard } from './TimelineCard';

export const GradientCard = ({ children, seed = 1234, variant }: { children: React.ReactNode, seed?: number, variant?: string }) => {
  const { gradientAngle, spots } = useMemo(() => {
    const random = mulberry32(seed);
    const angle = Math.floor(random() * 360);
    const spots = Array.from({ length: 5 }).map(() => ({
      x: random() * 100,
      y: random() * 100,
      size: random() * 30 + 10,
      opacity: variant === 'glow' ? random() * 0.2 + 0.1 : random() * 0.1 + 0.05
    }));
    return { gradientAngle: angle, spots };
  }, [seed, variant]);

  return (
    <div 
      className="relative p-4 rounded-2xl overflow-hidden shadow-lg border border-white/5"
      style={{
        background: `linear-gradient(${gradientAngle}deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))`
      }}
    >
      {spots.map((spot, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white blur-xl pointer-events-none"
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: `${spot.size}px`,
            height: `${spot.size}px`,
            opacity: spot.opacity
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const HoverCard = ({ children, seed = 5678 }: { children: React.ReactNode, seed?: number }) => {
  const { scratchX, scratchY, angle } = useMemo(() => {
    const random = mulberry32(seed);
    return {
      scratchX: random() * 80 + 10,
      scratchY: random() * 80 + 10,
      angle: random() * 45
    };
  }, [seed]);

  return (
    <div className="relative p-4 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:scale-[1.02] border border-white/10 group overflow-hidden">
      <div 
        className="absolute w-16 h-[1px] bg-white/20 -rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"
        style={{
          left: `${scratchX}%`,
          top: `${scratchY}%`,
          transform: `rotate(${angle}deg)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
export const StackCard = ({ children }: any) => <div className="p-4 border border-white/10 rounded-2xl">{children}</div>;
