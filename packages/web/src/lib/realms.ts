import React from 'react';

export type RealmId = 
  | 'cyber-neon' 
  | 'ironman-nano' 
  | 'venom-liquid' 
  | 'retro-tape'
  | 'minimal-glass';

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
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'High-contrast neon with laser-flash transitions.',
    story: 'Dark-glass panels with glowing cyan and magenta borders.',
    philosophy: 'Speed is everything.',
    color: '#00f0ff',
    icon: '⚡',
    material: {
      glass: 'rgba(0, 0, 0, 0.85)',
      metal: 'linear-gradient(90deg, #00f0ff, #ff007f)',
      surface: 'rgba(16, 16, 32, 0.7)',
      border: 'rgba(0, 240, 255, 0.6)',
      blur: '16px'
    },
    shape: 'hexagonal',
    motion: {
      transition: 'laser-flash',
      hover: { scale: 1.05, skewX: -2, filter: 'brightness(1.2)' },
      tap: { scale: 0.95, skewX: 2 }
    },
    typography: 'technical',
    robin: {
      body: '⚡',
      icon: '👾',
      particles: ['⚡', '💠', '✨'],
      idleBehaviors: ['dash', 'glitch', 'replicate'],
      personality: 'Efficient and sharp'
    },
    particles: ['⚡', '✨', '✧'],
    ambient: 'radial-gradient(circle at 50% 50%, rgba(255,0,127,0.1) 0%, #080810 100%)',
    config3D: {
        perspective: 1100,
        rotationX: 1,
        rotationY: -3,
        floatDistance: 14,
        glowColor: 'rgba(0,240,255,0.2)',
        backgroundGradient: 'radial-gradient(ellipse at 20% 40%, #080810, #030308)',
        cardTilt: 4,
        shadowIntensity: 0.35,
        animationDuration: 200,
        animationDelay: 0,
    },
  },
  {
    id: 'ironman-nano',
    name: 'Ironman Nano',
    description: 'Titanium framework with nano-tech assembly.',
    story: 'Matte titanium structural frameworks with integrated holographic micro-grids.',
    philosophy: 'Strength and precision.',
    color: '#f97316',
    icon: '⚙️',
    material: {
      glass: 'rgba(28, 25, 23, 0.95)',
      metal: 'linear-gradient(180deg, #444, #111)',
      surface: 'rgba(28, 25, 23, 0.9)',
      border: 'rgba(249, 115, 22, 0.5)',
      blur: '8px'
    },
    shape: 'industrial',
    motion: {
      transition: 'nano-assembly',
      hover: { scale: 1.02, rotateX: 5 },
      tap: { scale: 0.98, rotateX: -5 }
    },
    typography: 'technical',
    robin: {
      body: '🤖',
      icon: '⚙️',
      particles: ['⚙️', '🔥'],
      idleBehaviors: ['inspect', 'repair', 'weld'],
      personality: 'Engineering and precise'
    },
    particles: ['⚙️', '■', '▫'],
    ambient: 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.1) 0%, #0c0a09 100%)',
    config3D: {
        perspective: 1200,
        rotationX: 2,
        rotationY: 0,
        floatDistance: 8,
        glowColor: 'rgba(249,115,22,0.15)',
        backgroundGradient: 'radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.08), #0c0a09)',
        cardTilt: 4,
        shadowIntensity: 0.5,
        animationDuration: 400,
        animationDelay: 50,
      },
  },
  {
    id: 'venom-liquid',
    name: 'Venom Liquid',
    description: 'Amorphous fluid shadows with symbiotic engulfing.',
    story: 'Morphing amorphous fluid containers with organic dark-blob drop shadows.',
    philosophy: 'Adapt or be consumed.',
    color: '#ffffff',
    icon: '🌑',
    material: {
      glass: 'rgba(0, 0, 0, 0.9)',
      metal: 'linear-gradient(180deg, #111, #000)',
      surface: 'rgba(10, 10, 10, 0.9)',
      border: 'rgba(255, 255, 255, 0.1)',
      blur: '24px'
    },
    shape: 'organic',
    motion: {
      transition: 'engulf',
      hover: { scale: 1.05, borderRadius: '50%' },
      tap: { scale: 0.95 }
    },
    typography: 'modern',
    robin: {
      body: '🌑',
      icon: '🕷️',
      particles: ['⚫', '〰'],
      idleBehaviors: ['ooze', 'spread', 'consume'],
      personality: 'Aggressive and adaptive'
    },
    particles: ['⚫', '〰', '✧'],
    ambient: 'radial-gradient(circle at 50% 50%, rgba(50,50,50,0.1) 0%, #050505 100%)',
    config3D: {
        perspective: 900,
        rotationX: 3,
        rotationY: -1,
        floatDistance: 11,
        glowColor: 'rgba(255,255,255,0.05)',
        backgroundGradient: 'radial-gradient(ellipse at 40% 30%, #0a0a0a, #000000)',
        cardTilt: 5,
        shadowIntensity: 0.8,
        animationDuration: 600,
        animationDelay: 0,
    },
  },
  {
    id: 'retro-tape',
    name: 'Retro Tape Core',
    description: 'Gritty monochrome green CRT with tape winding physics.',
    story: 'Mechanical cassette-tape wrap physics with heavy digital scanlines.',
    philosophy: 'Respect the foundations.',
    color: '#22c55e',
    icon: '📼',
    material: {
      glass: 'rgba(5, 5, 5, 0.98)',
      metal: 'linear-gradient(180deg, #111, #000)',
      surface: 'rgba(10, 10, 10, 0.95)',
      border: '#14532d',
      blur: '2px'
    },
    shape: 'mechanical',
    motion: {
      transition: 'tape-wind',
      hover: { x: 2, filter: 'contrast(1.5)' },
      tap: { y: 2 }
    },
    typography: 'mono',
    robin: {
      body: '📼',
      icon: '📻',
      particles: ['█', '▄'],
      idleBehaviors: ['flicker', 'rewind', 'static'],
      personality: 'Calm and nostalgic'
    },
    particles: ['░', '▒', '▓'],
    ambient: '#050505',
    config3D: {
        perspective: 1000,
        rotationX: 1,
        rotationY: -2,
        floatDistance: 7,
        glowColor: 'rgba(34,197,94,0.1)',
        backgroundGradient: 'linear-gradient(to bottom, #050505, #0a0a0a)',
        cardTilt: 0,
        shadowIntensity: 0,
        animationDuration: 400,
        animationDelay: 0,
    },
  }
];
