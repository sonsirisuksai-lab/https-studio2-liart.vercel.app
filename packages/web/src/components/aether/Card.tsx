import React from 'react';

export const Card = ({ children, className }: any) => (
  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
    {children}
  </div>
);

export const AetherCard = Card;
