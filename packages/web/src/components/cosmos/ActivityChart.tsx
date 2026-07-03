import React, { useMemo } from 'react';
import { Glass } from '@/components/aether/Glass';

export const ActivityChart: React.FC = () => {
  const bars = useMemo(() => {
    // Fixed heights to satisfy linter purity rules
    const heights = [45, 72, 38, 85, 52, 67, 31, 89, 44, 76, 58, 63];
    return heights.map((height, i) => ({
      id: i,
      height
    }));
  }, []);

  return (
    <Glass className="p-6 h-64 flex items-center justify-center border-dashed border-white/10">
      <div className="text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Neural Activity Matrix</div>
        <div className="flex items-center gap-1 justify-center">
          {bars.map((bar) => (
            <div 
              key={bar.id} 
              className="w-1 bg-[var(--theme-primary)]/40 rounded-full" 
              style={{ height: `${bar.height}px` }}
            />
          ))}
        </div>
      </div>
    </Glass>
  );
};
