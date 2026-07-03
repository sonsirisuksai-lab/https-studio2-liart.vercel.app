import { createContext, ReactNode, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME, Theme } from '../lib/themes';

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: Theme[];
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}
