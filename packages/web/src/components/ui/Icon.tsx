// packages/web/src/components/ui/Icon.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/hooks/useDevice';
import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  strokeWidth?: number;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export function Icon({ name, size = 'md', className, color, strokeWidth: customStrokeWidth }: IconProps) {
  const IconComponent = (Icons as any)[name];
  const { device } = useDevice();
  
  // Use stroke-width consistent with device density
  const defaultStrokeWidth = device?.isIPad ? 2 : 1.5;
  const strokeWidth = customStrokeWidth || defaultStrokeWidth;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return (
    <IconComponent
      className={cn(sizeMap[size], color || 'text-current', className)}
      strokeWidth={strokeWidth}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
