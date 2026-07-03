// packages/web/src/hooks/useRealm.ts
import { useLocation } from 'react-router-dom';

export function useRealm() {
  const location = useLocation();
  const path = location.pathname;
  
  // Extract realm ID from path (e.g., /work -> work)
  const segments = path.split('/').filter(Boolean);
  const id = segments[0] || 'core';
  
  return { id, path };
}
