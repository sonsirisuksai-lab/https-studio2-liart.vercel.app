// packages/web/src/hooks/useReducedMotion.ts

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
