import React from 'react';

export const Skeleton = () => (
  <div className="relative overflow-hidden bg-white/5 rounded-2xl w-full h-full min-h-[100px]">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);
