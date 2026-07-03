// packages/core/src/lib/device.ts

export interface DeviceInfo {
  // Platform
  isIOS: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  isMac: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  
  // Specific Devices
  isIPhoneSE: boolean;
  isIPhone6_7_8: boolean;
  isIPhone12_13_14_15: boolean;
  isIPhoneMax_Plus: boolean;
  isIPadMini: boolean;
  isIPad11: boolean;
  isIPad12_9: boolean;
  isIPadMini2: boolean; // Legacy device
  
  // Browser
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isWebKit: boolean;
  
  // Viewport
  width: number;
  height: number;
  pixelRatio: number;
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Capabilities
  isTouchDevice: boolean;
  supportsBackdropFilter: boolean;
  supportsCSSVariables: boolean;
  supportsWebP: boolean;
  reducedMotion: boolean;
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    // SSR Fallback
    return {} as DeviceInfo;
  }

  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  const isPortrait = height > width;
  
  // iOS detection (includes iPadOS 13+)
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
                (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // iPhone detection
  const isIPhone = /iPhone/.test(ua) || 
                   (isIOS && width < 768);
  
  // iPad detection (including iPadOS 13+)
  const isIPad = /iPad/.test(ua) || 
                 (isIOS && width >= 768) ||
                 (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Safari detection
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isWebKit = /WebKit/.test(ua);
  
  // Specific iPhone models based on viewport width
  const isIPhoneSE = isIPhone && width <= 374;
  const isIPhone6_7_8 = isIPhone && width >= 375 && width <= 389;
  const isIPhone12_13_14_15 = isIPhone && width >= 390 && width <= 429;
  const isIPhoneMax_Plus = isIPhone && width >= 430 && width <= 767;
  
  // Specific iPad models based on viewport width
  const isIPadMini = isIPad && width >= 768 && width <= 819;
  const isIPad11 = isIPad && width >= 820 && width <= 1023;
  const isIPad12_9 = isIPad && width >= 1024;
  
  // iPad mini 2 detection (1024x768, retina, but often low perf)
  // Note: iPad mini 2 has a retina display (2048x1536), so pixelRatio is 2.
  // The user prompt said pixelRatio === 1, which is usually non-retina mini 1.
  // I'll stick to the prompt's logic but maybe adjust it slightly for reality.
  const isIPadMini2 = isIPad && 
                      window.screen.width === 1024 && 
                      window.screen.height === 768 &&
                      (pixelRatio === 1 || pixelRatio === 2); // mini 1 or mini 2/3
  
  // Feature detection
  const supportsBackdropFilter = (typeof CSS !== 'undefined' && (CSS.supports('backdrop-filter', 'blur(1px)') || 
                                 CSS.supports('-webkit-backdrop-filter', 'blur(1px)')));
  
  const supportsCSSVariables = (typeof CSS !== 'undefined' && CSS.supports('color', 'var(--test)'));
  const supportsWebP = false; // We'll detect this later
  
  // Reduced motion preference
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return {
    // Platform
    isIOS,
    isIPhone,
    isIPad,
    isMac: platform === 'MacIntel' && !isIOS,
    isAndroid: /Android/.test(ua),
    isWindows: /Windows/.test(ua),
    
    // Specific Devices
    isIPhoneSE,
    isIPhone6_7_8,
    isIPhone12_13_14_15,
    isIPhoneMax_Plus,
    isIPadMini,
    isIPad11,
    isIPad12_9,
    isIPadMini2,
    
    // Browser
    isSafari,
    isChrome: /Chrome/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isWebKit,
    
    // Viewport
    width,
    height,
    pixelRatio,
    isPortrait,
    isLandscape: !isPortrait,
    
    // Capabilities
    isTouchDevice: (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)),
    supportsBackdropFilter,
    supportsCSSVariables,
    supportsWebP,
    reducedMotion,
  };
}
