import React from 'react';
import { Glass } from '@/components/aether/Glass';
import { Label } from '@/components/aether/Typography';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color }) => {
  return (
    <Glass className="p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-white/40">{label}</Label>
        <div className="text-xl" style={{ color }}>{icon}</div>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      {trend && (
        <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
          {trend}
        </div>
      )}
    </Glass>
  );
};
