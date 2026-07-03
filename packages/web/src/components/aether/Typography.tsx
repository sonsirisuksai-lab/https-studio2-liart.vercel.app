import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  size?: string;
  weight?: string;
}

export const Heading: React.FC<TypographyProps> = ({ children, className, size = '32', weight = '600' }) => {
  return (
    <h1 
      className={cn('tracking-tight leading-tight', className)} 
      style={{ fontSize: `${size}px`, fontWeight: weight }}
    >
      {children}
    </h1>
  );
};

export const Body: React.FC<TypographyProps> = ({ children, className, size = '16', weight = '400' }) => {
  return (
    <p 
      className={cn('leading-relaxed opacity-80', className)} 
      style={{ fontSize: `${size}px`, fontWeight: weight }}
    >
      {children}
    </p>
  );
};

export const Label: React.FC<TypographyProps> = ({ children, className, size = '12', weight = '700' }) => {
  return (
    <span 
      className={cn('uppercase tracking-widest opacity-60 block mb-1', className)} 
      style={{ fontSize: `${size}px`, fontWeight: weight }}
    >
      {children}
    </span>
  );
};
