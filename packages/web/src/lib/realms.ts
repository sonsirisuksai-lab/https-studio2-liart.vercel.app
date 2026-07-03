import React from 'react';

export type RealmId = 
  | 'starlight' 
  | 'void' 
  | 'aurora' 
  | 'retro' 
  | 'cyber' 
  | 'iron-core' 
  | 'magic' 
  | 'ocean' 
  | 'library' 
  | 'blueprint'
  | 'venom';

export interface RealmMaterial {
  glass: string;
  metal: string;
  surface: string;
  border: string;
  blur: string;
}

export interface RealmMotion {
  transition: string;
  hover: any;
  tap: any;
}

export interface RealmRobinConfig {
  body: string;
  icon: string;
  particles: string[];
  idleBehaviors: string[];
  personality: string;
}

export interface Realm3DConfig {
  perspective: number;
  rotationX: number;
  rotationY: number;
  floatDistance: number;
  glowColor: string;
  backgroundGradient: string;
  cardTilt: number;
  shadowIntensity: number;
  animationDuration: number;
  animationDelay: number;
}

export interface Realm {
  id: RealmId;
  name: string;
  description: string;
  story: string;
  philosophy: string;
  color: string;
  icon: string;
  material: RealmMaterial;
  shape: 'rounded' | 'mechanical' | 'organic' | 'industrial' | 'hexagonal' | 'architectural';
  motion: RealmMotion;
  typography: 'modern' | 'mono' | 'serif' | 'display' | 'technical';
  robin: RealmRobinConfig;
  particles: string[];
  ambient: string;
  config3D: Realm3DConfig;
}

export const realms: Realm[] = [
  {
    id: 'starlight',
    name: 'Starlight',
    description: 'The primary beacon of COSMOS.',
    story: 'Born from the first light of a dying star, Starlight represents hope and clarity.',
    philosophy: 'Clarity over complexity.',
    color: '#60A5FA',
    icon: '🌌',
    material: {
      glass: 'rgba(255, 255, 255, 0.08)',
      metal: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      surface: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.15)',
      blur: '24px'
    },
    shape: 'rounded',
    motion: {
      transition: 'spring',
      hover: { scale: 1.02 },
      tap: { scale: 0.98 }
    },
    typography: 'modern',
    robin: {
      body: '🛸',
      icon: '🛸',
      particles: ['✨', '⭐'],
      idleBehaviors: ['float', 'scan', 'wave'],
      personality: 'Helpful and curious'
    },
    particles: ['✨', '⭐'],
    ambient: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)',
    config3D: {
        perspective: 1200,
        rotationX: 2,
        rotationY: 0,
        floatDistance: 8,
        glowColor: 'rgba(139,92,246,0.15)',
        backgroundGradient: 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.08), transparent 70%)',
        cardTilt: 4,
        shadowIntensity: 0.3,
        animationDuration: 400,
        animationDelay: 0,
      },
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Analog memories in a digital age.',
    story: 'A realm where electrons travel through vacuum tubes and data is stored on magnetic tape.',
    philosophy: 'Respect the foundations.',
    color: '#F59E0B',
    icon: '📻',
    material: {
      glass: 'rgba(20, 20, 20, 0.9)',
      metal: 'linear-gradient(180deg, #333, #111)',
      surface: '#221a15',
      border: 'rgba(245, 158, 11, 0.3)',
      blur: '4px'
    },
    shape: 'mechanical',
    motion: {
      transition: 'flicker',
      hover: { x: 2 },
      tap: { y: 2 }
    },
    typography: 'mono',
    robin: {
      body: '📺',
      icon: '🤖',
      particles: ['📟', '📼'],
      idleBehaviors: ['flicker', 'rewind', 'static'],
      personality: 'Calm and nostalgic'
    },
    particles: ['░', '▒', '▓'],
    ambient: '#1a1410',
    config3D: {
        perspective: 1000,
        rotationX: 1,
        rotationY: -2,
        floatDistance: 7,
        glowColor: 'rgba(244,63,94,0.12)',
        backgroundGradient: 'radial-gradient(ellipse at 30% 30%, #2A0F1F, #0A050A)',
        cardTilt: 3,
        shadowIntensity: 0.4,
        animationDuration: 400,
        animationDelay: 80,
    },
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'High-speed data stream.',
    story: 'The core of the network where time is measured in nanoseconds.',
    philosophy: 'Speed is everything.',
    color: '#FF007F',
    icon: '💠',
    material: {
      glass: 'rgba(0, 0, 0, 0.95)',
      metal: 'linear-gradient(90deg, #00f0ff, #ff007f)',
      surface: '#080810',
      border: 'rgba(255, 0, 127, 0.5)',
      blur: '12px'
    },
    shape: 'hexagonal',
    motion: {
      transition: 'glitch',
      hover: { scale: 1.05, skewX: -5 },
      tap: { scale: 0.95, skewX: 5 }
    },
    typography: 'technical',
    robin: {
      body: '🛸',
      icon: '🛸',
      particles: ['💠', '⚡'],
      idleBehaviors: ['dash', 'glitch', 'replicate'],
      personality: 'Efficient and sharp'
    },
    particles: ['0', '1', '⚡'],
    ambient: '#020205',
    config3D: {
        perspective: 1100,
        rotationX: 1,
        rotationY: -3,
        floatDistance: 14,
        glowColor: 'rgba(90,200,250,0.10)',
        backgroundGradient: 'radial-gradient(ellipse at 20% 40%, #0A1A2A, #0A0A0A)',
        cardTilt: 4,
        shadowIntensity: 0.35,
        animationDuration: 450,
        animationDelay: 100,
    },
  },
  {
    id: 'magic',
    name: 'Magic',
    description: 'Ancient runes and arcane energy.',
    story: 'Where code is written in blood and compiled by the moon.',
    philosophy: 'The unseen is real.',
    color: '#A855F7',
    icon: '🔮',
    material: {
      glass: 'rgba(40, 10, 60, 0.4)',
      metal: 'linear-gradient(45deg, #4c1d95, #7c3aed)',
      surface: '#1e1b4b',
      border: 'rgba(167, 139, 250, 0.4)',
      blur: '40px'
    },
    shape: 'organic',
    motion: {
      transition: 'portal',
      hover: { rotate: 5, scale: 1.1 },
      tap: { rotate: -5, scale: 0.9 }
    },
    typography: 'serif',
    robin: {
      body: '🧚',
      icon: '✨',
      particles: ['🔮', '🌙'],
      idleBehaviors: ['chant', 'glow', 'teleport'],
      personality: 'Mystical and wise'
    },
    particles: ['✨', '✵', '❄'],
    ambient: 'linear-gradient(to bottom, #0f0720, #020617)',
    config3D: {
        perspective: 1400,
        rotationX: 1,
        rotationY: 3,
        floatDistance: 12,
        glowColor: 'rgba(175,82,222,0.15)',
        backgroundGradient: 'radial-gradient(ellipse at 50% 30%, #1A0A2E, #0A0A1A)',
        cardTilt: 5,
        shadowIntensity: 0.4,
        animationDuration: 500,
        animationDelay: 100,
    },
  },
  {
    id: 'iron-core',
    name: 'Iron Core',
    description: 'Mechanical engineering and raw power.',
    story: 'Forged in the heart of a volcanic planet, where machines build machines.',
    philosophy: 'Strength and precision.',
    color: '#f97316',
    icon: '⚙️',
    material: {
      glass: 'rgba(28, 25, 23, 0.95)',
      metal: 'linear-gradient(180deg, #444, #111)',
      surface: '#1c1917',
      border: 'rgba(249, 115, 22, 0.4)',
      blur: '2px'
    },
    shape: 'industrial',
    motion: {
      transition: 'mechanical',
      hover: { scale: 1.02, rotateX: 10 },
      tap: { scale: 0.98, rotateX: -10 }
    },
    typography: 'technical',
    robin: {
      body: '🤖',
      icon: '🛠️',
      particles: ['⚙️', '🔧'],
      idleBehaviors: ['inspect', 'repair', 'weld'],
      personality: 'Engineering and precise'
    },
    particles: ['💨', '🔥'],
    ambient: '#0c0a09',
    config3D: {
        perspective: 1200,
        rotationX: 2,
        rotationY: 0,
        floatDistance: 8,
        glowColor: 'rgba(139,92,246,0.15)',
        backgroundGradient: 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.08), transparent 70%)',
        cardTilt: 4,
        shadowIntensity: 0.3,
        animationDuration: 400,
        animationDelay: 0,
      },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drafts and architectural vision.',
    story: 'The drafting board of the universe where every atom is planned.',
    philosophy: 'Design is the foundation.',
    color: '#3b82f6',
    icon: '📐',
    material: {
      glass: 'rgba(30, 58, 138, 0.8)',
      metal: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
      surface: '#1e3a8a',
      border: 'rgba(255, 255, 255, 0.4)',
      blur: '0px'
    },
    shape: 'architectural',
    motion: {
      transition: 'drawing',
      hover: { scale: 1.01, y: -5 },
      tap: { scale: 0.99, y: 0 }
    },
    typography: 'technical',
    robin: {
      body: '📏',
      icon: '🖋️',
      particles: ['📐', '🔵'],
      idleBehaviors: ['draw', 'measure', 'plan'],
      personality: 'Architectural and structured'
    },
    particles: ['┼', '┘', '┌'],
    ambient: '#1e3a8a',
    config3D: {
        perspective: 1000,
        rotationX: 1,
        rotationY: 1,
        floatDistance: 6,
        glowColor: 'rgba(148,163,184,0.10)',
        backgroundGradient: 'radial-gradient(ellipse at 50% 50%, #1F2937, #030712)',
        cardTilt: 3,
        shadowIntensity: 0.3,
        animationDuration: 300,
        animationDelay: 100,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep currents and fluid data.',
    story: 'An underwater civilization where data flows like water.',
    philosophy: 'Go with the flow.',
    color: '#06b6d4',
    icon: '🌊',
    material: {
      glass: 'rgba(8, 145, 178, 0.2)',
      metal: 'linear-gradient(to bottom, #0891b2, #155e75)',
      surface: '#083344',
      border: 'rgba(34, 211, 238, 0.3)',
      blur: '60px'
    },
    shape: 'organic',
    motion: {
      transition: 'ripple',
      hover: { y: -10, rotate: 2 },
      tap: { y: 2, rotate: -2 }
    },
    typography: 'modern',
    robin: {
      body: '🫧',
      icon: '🐚',
      particles: ['🫧', '💧'],
      idleBehaviors: ['swim', 'bubble', 'drift'],
      personality: 'Explorer and fluid'
    },
    particles: ['🫧', '💧', '🌊'],
    ambient: 'linear-gradient(to bottom, #083344, #020617)',
    config3D: {
        perspective: 1100,
        rotationX: 2,
        rotationY: 1,
        floatDistance: 8,
        glowColor: 'rgba(99,102,241,0.12)',
        backgroundGradient: 'radial-gradient(ellipse at 50% 40%, #0F1F2A, #050A0A)',
        cardTilt: 4,
        shadowIntensity: 0.3,
        animationDuration: 500,
        animationDelay: 120,
    },
  },
  {
    id: 'library',
    name: 'Library',
    description: 'The archive of all known things.',
    story: 'A timeless sanctuary where knowledge is preserved in paper and ink.',
    philosophy: 'Knowledge is eternal.',
    color: '#92400e',
    icon: '📜',
    material: {
      glass: 'rgba(254, 252, 232, 0.9)',
      metal: 'linear-gradient(45deg, #92400e, #78350f)',
      surface: '#451a03',
      border: 'rgba(146, 64, 14, 0.2)',
      blur: '4px'
    },
    shape: 'architectural',
    motion: {
      transition: 'unfolding',
      hover: { scale: 1.03, z: 20 },
      tap: { scale: 0.97, z: 0 }
    },
    typography: 'serif',
    robin: {
      body: '📖',
      icon: '🖋️',
      particles: ['🔖', '📜'],
      idleBehaviors: ['read', 'write', 'organize'],
      personality: 'Teacher and researcher'
    },
    particles: ['🍂', '📜', '✨'],
    ambient: '#2d1a10',
    config3D: {
        perspective: 1000,
        rotationX: 1,
        rotationY: -2,
        floatDistance: 7,
        glowColor: 'rgba(244,63,94,0.12)',
        backgroundGradient: 'radial-gradient(ellipse at 30% 30%, #2A0F1F, #0A050A)',
        cardTilt: 3,
        shadowIntensity: 0.4,
        animationDuration: 400,
        animationDelay: 80,
    },
  },
  {
    id: 'venom',
    name: 'Venom',
    description: 'Dark fluidity and symbiote intelligence.',
    story: 'A living darkness that adapts to its host.',
    philosophy: 'Adapt or be consumed.',
    color: '#000000',
    icon: '🖤',
    material: {
      glass: 'rgba(0, 0, 0, 0.8)',
      metal: 'linear-gradient(180deg, #111, #000)',
      surface: '#000000',
      border: 'rgba(255, 255, 255, 0.1)',
      blur: '20px'
    },
    shape: 'organic',
    motion: {
      transition: 'ooze',
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    },
    typography: 'modern',
    robin: {
      body: '🕷️',
      icon: '🖤',
      particles: ['⚫', '🕸️'],
      idleBehaviors: ['ooze', 'spread', 'consume'],
      personality: 'Aggressive and adaptive'
    },
    particles: ['⚫', '🕸️', '🕷️'],
    ambient: '#000000',
    config3D: {
        perspective: 900,
        rotationX: 3,
        rotationY: -1,
        floatDistance: 11,
        glowColor: 'rgba(20,184,166,0.15)',
        backgroundGradient: 'radial-gradient(ellipse at 40% 30%, #0F2F2E, #050A0A)',
        cardTilt: 5,
        shadowIntensity: 0.5,
        animationDuration: 380,
        animationDelay: 60,
    },
  }
];
