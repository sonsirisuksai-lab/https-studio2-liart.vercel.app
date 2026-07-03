// packages/web/src/components/ui/ResponsiveContainer.tsx

import React from 'react';
import { useDevice } from '@/hooks/useDevice';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  const { device } = useDevice();
  
  // Dynamic classes based on device
  const containerClasses = [
    'w-full mx-auto px-4 md:px-8',
    device?.isIPhoneSE ? 'max-w-[320px]' : '',
    device?.isIPhone12_13_14_15 ? 'max-w-[390px]' : '',
    device?.isIPhoneMax_Plus ? 'max-w-[430px]' : '',
    device?.isIPad ? 'max-w-4xl' : '',
    device?.isIPad12_9 ? 'max-w-6xl' : '',
    className || '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
