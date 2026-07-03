import React from 'react';
import { Glass } from '@/components/aether/Glass3D';
import { Label, Body } from '@/components/aether/Typography';
import { cn } from '@/lib/utils';

export const TimelineCard = ({ items, className }: { items: any[], className?: string }) => (
  <Glass className={cn("p-[var(--space-4)]", className)}>
    <Label>Project Timeline</Label>
    <div className="space-y-[var(--space-4)] mt-[var(--space-4)]">
      {items.map(item => (
        <div key={item.id} className="flex gap-[var(--space-4)]">
          <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)] mt-2 shrink-0" />
          <div>
            <div className="text-sm font-bold text-[var(--theme-text)]">{item.title}</div>
            <Body size="12" className="text-[var(--theme-text-secondary)]">{item.description}</Body>
          </div>
        </div>
      ))}
    </div>
  </Glass>
);
