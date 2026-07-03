/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from 'react';

export type MediaTab = 'music' | 'images' | 'videos';

interface MediaHubState {
  activeTab: MediaTab;
  setActiveTab: (tab: MediaTab) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const MediaHubContext = createContext<MediaHubState | undefined>(undefined);

export const MediaHubProvider: React.FC<{children: React.ReactNode}> = React.memo(({ children }) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('music');
  const [isPlaying, setIsPlaying] = useState(false);

  const value = useMemo(() => ({ activeTab, setActiveTab, isPlaying, setIsPlaying }), [activeTab, isPlaying]);

  return <MediaHubContext.Provider value={value}>{children}</MediaHubContext.Provider>;
});

export const useMediaHub = () => {
  const ctx = useContext(MediaHubContext);
  if (!ctx) throw new Error('useMediaHub must be used within MediaHubProvider');
  return ctx;
};
