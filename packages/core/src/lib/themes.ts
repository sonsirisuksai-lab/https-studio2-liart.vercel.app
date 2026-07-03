export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const THEMES: Theme[] = [
  { id: 'starlight', name: 'Starlight', icon: '✨', description: 'Pure, clear, and focused light theme.', color: '#7C3AED' },
  { id: 'void', name: 'Void', icon: '🌌', description: 'Deep space dark theme for focused sessions.', color: '#3B82F6' },
  { id: 'nebula', name: 'Nebula', icon: '🌠', description: 'Vibrant cosmic purple and blue accents.', color: '#C084FC' },
  { id: 'solar', name: 'Solar', icon: '☀️', description: 'Warm energy and golden highlights.', color: '#F59E0B' },
  { id: 'lunar', name: 'Lunar', icon: '🌙', description: 'Cold, serene, and silver-toned atmosphere.', color: '#94A3B8' },
  { id: 'aurora', name: 'Aurora', icon: '🌲', description: 'Dancing greens and mystic energy.', color: '#10B981' },
  { id: 'cyber', name: 'Cyber', icon: '👾', description: 'High-contrast neon and grid-based visuals.', color: '#EC4899' },
];

export const DEFAULT_THEME = 'starlight';

export const THEME_SWATCHES: Record<string, { primary: string; secondary: string; bg: string }> = {
  starlight: { primary: '#7C3AED', secondary: '#4F46E5', bg: '#F1F5F9' },
  void: { primary: '#3B82F6', secondary: '#1E293B', bg: '#020205' },
  nebula: { primary: '#8B5CF6', secondary: '#EC4899', bg: '#0B0B16' },
  solar: { primary: '#D97706', secondary: '#78350F', bg: '#1A1715' },
  lunar: { primary: '#64748B', secondary: '#475569', bg: '#020617' },
  aurora: { primary: '#10B981', secondary: '#059669', bg: '#050805' },
  cyber: { primary: '#EC4899', secondary: '#06B6D4', bg: '#030308' },
};

