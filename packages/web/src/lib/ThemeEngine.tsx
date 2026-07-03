/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

export type ThemeId = 'cyber-neon' | 'ironman-nano' | 'venom-liquid' | 'retro-tape';

export interface ThemeEngineContextType {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  getMountAnimation: () => Variants;
}

const ThemeEngineContext = createContext<ThemeEngineContextType | undefined>(undefined);

export function ThemeEngineProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('cosmos-master-theme') as ThemeId;
    return saved || 'cyber-neon';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('cosmos-master-theme', themeId);
  }, [themeId]);

  const getMountAnimation = useCallback(() => {
    switch (themeId) {
      case 'cyber-neon':
        return {
          initial: { opacity: 0, scale: 0.9, filter: 'brightness(2) contrast(1.5)', boxShadow: '0 0 100px #00f0ff' },
          animate: { opacity: 1, scale: 1, filter: 'brightness(1) contrast(1)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' },
          exit: { opacity: 0, scale: 1.1, filter: 'brightness(3)', boxShadow: '0 0 200px #ff007f' }
        };
      case 'ironman-nano':
        return {
          initial: { opacity: 0, scale: 0.1, rotateX: 90, borderRadius: '100%' },
          animate: { opacity: 1, scale: 1, rotateX: 0, borderRadius: '4px' },
          exit: { opacity: 0, scale: 0.5, rotateX: -90, borderRadius: '100%' }
        };
      case 'venom-liquid':
        return {
          initial: { opacity: 0, scale: 1.2, borderRadius: '100%', filter: 'blur(20px)' },
          animate: { opacity: 1, scale: 1, borderRadius: '24px', filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.8, borderRadius: '50%', filter: 'blur(10px)' }
        };
      case 'retro-tape':
        return {
          initial: { opacity: 0, height: 0, y: -50, filter: 'grayscale(1)' },
          animate: { opacity: 1, height: 'auto', y: 0, filter: 'grayscale(0)' },
          exit: { opacity: 0, height: 0, y: 50, filter: 'grayscale(1)' }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  }, [themeId]);

  const value = useMemo(() => ({ themeId, setTheme: setThemeId, getMountAnimation }), [themeId, getMountAnimation]);

  return (
    <ThemeEngineContext.Provider value={value}>
      {children}
    </ThemeEngineContext.Provider>
  );
}

export function useThemeEngine() {
  const context = useContext(ThemeEngineContext);
  if (!context) throw new Error('useThemeEngine must be used within ThemeEngineProvider');
  return context;
}
