// packages/web/src/hooks/useSound.ts
import { useCallback, useEffect, useState } from 'react';
import { audioEngine, getDeviceInfo } from '@cosmos/core';

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const device = getDeviceInfo();
    // Disable on iPad mini 2 for performance by default
    return !device.isIPadMini2;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize on first user interaction
    const initAudio = () => {
      audioEngine.initialize();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const playClick = useCallback(() => {
    if (isEnabled) audioEngine.playClick();
  }, [isEnabled]);

  const playHover = useCallback(() => {
    if (isEnabled) audioEngine.playHover();
  }, [isEnabled]);

  const playFlip = useCallback(() => {
    if (isEnabled) audioEngine.playFlip();
  }, [isEnabled]);

  const playOpen = useCallback(() => {
    if (isEnabled) audioEngine.playOpen();
  }, [isEnabled]);

  const playClose = useCallback(() => {
    if (isEnabled) audioEngine.playClose();
  }, [isEnabled]);

  const playError = useCallback(() => {
    if (isEnabled) audioEngine.playError();
  }, [isEnabled]);

  const playVinylDrop = useCallback(() => {
    if (isEnabled) audioEngine.playVinylDrop();
  }, [isEnabled]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    playClick,
    playHover,
    playFlip,
    playOpen,
    playClose,
    playError,
    playVinylDrop,
    isEnabled,
    toggle,
  };
}
