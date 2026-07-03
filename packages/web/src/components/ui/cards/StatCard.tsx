import React from 'react';
import { Glass } from '@/components/aether/Glass3D';
import { Label, Heading } from '@/components/aether/Typography';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | number;
  trendValue?: string | number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendValue, className }) => {
  const trendDir = typeof trend === 'number' ? (trend >= 0 ? 'up' : 'down') : trend;
  const displayTrend = typeof trend === 'number' ? `${Math.abs(trend)}%` : trendValue;
  
  return (
    <Glass className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <Label>{label}</Label>
        <div className="opacity-80">{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <Heading size="32">{value}</Heading>
        {trend && (
          <span className={`text-xs mb-1 ${trendDir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendDir === 'up' ? '↑' : '↓'} {displayTrend}
          </span>
        )}
      </div>
    </Glass>
  );
};
