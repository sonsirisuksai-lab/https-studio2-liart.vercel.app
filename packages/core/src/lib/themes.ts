export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const THEMES: Theme[] = [
  { id: 'cyber-neon', name: 'Cyber Neon', icon: '⚡', description: 'High-contrast neon with laser-flash transitions.', color: '#00f0ff' },
  { id: 'ironman-nano', name: 'Ironman Nano', icon: '⚙️', description: 'Titanium framework with nano-tech assembly.', color: '#f97316' },
  { id: 'venom-liquid', name: 'Venom Liquid', icon: '🌑', description: 'Amorphous fluid shadows with symbiotic engulfing.', color: '#000000' },
  { id: 'retro-tape', name: 'Retro Tape Core', icon: '📼', description: 'Gritty monochrome green CRT with tape winding physics.', color: '#22c55e' },
];

export const DEFAULT_THEME = 'cyber-neon';

export const THEME_SWATCHES: Record<string, { primary: string; secondary: string; bg: string }> = {
  'cyber-neon': { primary: '#00f0ff', secondary: '#ff007f', bg: '#080810' },
  'ironman-nano': { primary: '#f97316', secondary: '#ef4444', bg: '#0c0a09' },
  'venom-liquid': { primary: '#000000', secondary: '#111111', bg: '#050505' },
  'retro-tape': { primary: '#22c55e', secondary: '#15803d', bg: '#050505' },
};

