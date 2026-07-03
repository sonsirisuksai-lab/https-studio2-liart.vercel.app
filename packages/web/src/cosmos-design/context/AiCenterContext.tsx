/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from 'react';

export type AiTab = 'agent' | 'knowledge' | 'prompt';

interface AiCenterState {
  activeTab: AiTab;
  setActiveTab: (tab: AiTab) => void;
  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
}

const AiCenterContext = createContext<AiCenterState | undefined>(undefined);

export const AiCenterProvider: React.FC<{children: React.ReactNode}> = React.memo(({ children }) => {
  const [activeTab, setActiveTab] = useState<AiTab>('agent');
  const [isThinking, setIsThinking] = useState(false);

  const value = useMemo(() => ({ activeTab, setActiveTab, isThinking, setIsThinking }), [activeTab, isThinking]);

  return <AiCenterContext.Provider value={value}>{children}</AiCenterContext.Provider>;
});

export const useAiCenter = () => {
  const ctx = useContext(AiCenterContext);
  if (!ctx) throw new Error('useAiCenter must be used within AiCenterProvider');
  return ctx;
};
