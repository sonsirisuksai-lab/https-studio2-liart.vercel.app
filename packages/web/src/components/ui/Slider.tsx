import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  label,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full flex flex-col gap-2', disabled && 'opacity-40 pointer-events-none', className)}>
      {label && (
        <div className="flex justify-between text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
          <span>{label}</span>
          <span className="font-mono">{value}</span>
        </div>
      )}
      <div className="relative w-full h-5 flex items-center group cursor-pointer">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/20 pointer-events-none transition-transform group-hover:scale-125 z-0"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
