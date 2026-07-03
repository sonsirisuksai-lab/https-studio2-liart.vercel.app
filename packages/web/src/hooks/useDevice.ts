// packages/web/src/hooks/useDevice.ts

import { useState, useEffect } from 'react';
import { getDeviceInfo, DeviceInfo } from '@cosmos/core';

export function useDevice() {
  const [device, setDevice] = useState<DeviceInfo | null>(() => {
    if (typeof window !== 'undefined') return getDeviceInfo();
    return null;
  });
  const [loading, setLoading] = useState(() => device ? false : true);

  useEffect(() => {
    // Handle resize/orientation change
    const handleResize = () => {
      setDevice(getDeviceInfo());
    };

    // Handle reduced motion preference change
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setDevice(prev => {
        if (!prev) return null;
        return { ...prev, reducedMotion: e.matches };
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMedia.addEventListener('change', handleReducedMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      motionMedia.removeEventListener('change', handleReducedMotion);
    };
  }, []);

  return { device, loading };
}
