import React from 'react';

export const GlowDial = ({ className }: { className?: string }) => (
  <div className={`rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center ${className}`}>
    <div className="w-3/4 h-3/4 rounded-full border border-purple-500/30 animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.2)]" />
  </div>
);
