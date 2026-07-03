import React from 'react';
import { Glass } from '@/components/aether/Glass3D';
import { Label, Body } from '@/components/aether/Typography';
import { cn } from '@/lib/utils';

export const TimelineCard = ({ items, className }: { items: any[], className?: string }) => (
  <Glass className={cn("p-4", className)}>
    <Label>Project Timeline</Label>
    <div className="space-y-4 mt-4">
      {items.map(item => (
        <div key={item.id} className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
          <div>
            <div className="text-sm font-bold">{item.title}</div>
            <Body size="12">{item.description}</Body>
          </div>
        </div>
      ))}
    </div>
  </Glass>
);
