export interface MobileThemeColors {
  background: string;
  card: string;
  glass: string;
  border: string;
  primary: string;
  text: string;
  textSecondary: string;
}

export const MOBILE_THEME_MAP: Record<string, MobileThemeColors> = {
  aether: {
    background: '#0B0F19',
    card: '#161B2B',
    glass: 'rgba(25, 30, 48, 0.65)',
    border: 'rgba(139, 92, 246, 0.25)',
    primary: '#8B5CF6',
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
  },
  lunar: {
    background: '#0A0C10',
    card: '#12161F',
    glass: 'rgba(20, 25, 35, 0.7)',
    border: 'rgba(148, 163, 184, 0.2)',
    primary: '#94A3B8',
    text: '#E2E8F0',
    textSecondary: '#64748B',
  },
  aurora: {
    background: '#020617',
    card: '#0F172A',
    glass: 'rgba(15, 23, 42, 0.65)',
    border: 'rgba(6, 182, 212, 0.3)',
    primary: '#06B6D4',
    text: '#FFFFFF',
    textSecondary: '#38BDF8',
  },
  forest: {
    background: '#041E12',
    card: '#0B2E1D',
    glass: 'rgba(11, 46, 29, 0.65)',
    border: 'rgba(34, 197, 94, 0.25)',
    primary: '#22C55E',
    text: '#F0FDF4',
    textSecondary: '#86EFAC',
  },
  retro: {
    background: '#121212',
    card: '#1C1A17',
    glass: 'rgba(28, 26, 23, 0.8)',
    border: '#F59E0B',
    primary: '#F59E0B',
    text: '#F5F5F4',
    textSecondary: '#A8A29E',
  },
  cosmic: {
    background: '#05050A',
    card: '#0F0E17',
    glass: 'rgba(15, 14, 23, 0.75)',
    border: 'rgba(255, 107, 53, 0.3)',
    primary: '#FF6B35',
    text: '#FFFFFF',
    textSecondary: '#FF9E79',
  },
  minimal: {
    background: '#FFFFFF',
    card: '#F4F4F5',
    glass: 'rgba(244, 244, 245, 0.8)',
    border: '#E4E4E7',
    primary: '#000000',
    text: '#09090B',
    textSecondary: '#71717A',
  },
  nebula: {
    background: '#0D0B21',
    card: '#1B173B',
    glass: 'rgba(27, 23, 59, 0.7)',
    border: 'rgba(139, 92, 246, 0.3)',
    primary: '#8B5CF6',
    text: '#FFFFFF',
    textSecondary: '#C084FC',
  },
  galaxy: {
    background: '#050B14',
    card: '#0C152B',
    glass: 'rgba(12, 21, 43, 0.7)',
    border: 'rgba(59, 130, 246, 0.3)',
    primary: '#3B82F6',
    text: '#FFFFFF',
    textSecondary: '#93C5FD',
  },
  'studio-pro': {
    background: '#0A0A0C',
    card: '#141416',
    glass: 'rgba(20, 20, 22, 0.75)',
    border: 'rgba(16, 185, 129, 0.3)',
    primary: '#10B981',
    text: '#E2E8F0',
    textSecondary: '#6EE7B7',
  },
  synthwave: {
    background: '#150624',
    card: '#290E43',
    glass: 'rgba(41, 14, 67, 0.7)',
    border: 'rgba(236, 72, 153, 0.3)',
    primary: '#EC4899',
    text: '#FFFFFF',
    textSecondary: '#F472B6',
  },
};

export function getMobileTheme(themeId: string): MobileThemeColors {
  return MOBILE_THEME_MAP[themeId] || MOBILE_THEME_MAP.aether;
}
