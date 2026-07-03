/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from 'react';

export type PersonalTab = 'dna' | 'timeline' | 'notes' | 'memory' | 'bookmark';

interface PersonalSpaceState {
  activeTab: PersonalTab;
  setActiveTab: (tab: PersonalTab) => void;
}

const PersonalSpaceContext = createContext<PersonalSpaceState | undefined>(undefined);

export const PersonalSpaceProvider: React.FC<{children: React.ReactNode}> = React.memo(({ children }) => {
  const [activeTab, setActiveTab] = useState<PersonalTab>('dna');

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return <PersonalSpaceContext.Provider value={value}>{children}</PersonalSpaceContext.Provider>;
});

export const usePersonalSpace = () => {
  const ctx = useContext(PersonalSpaceContext);
  if (!ctx) throw new Error('usePersonalSpace must be used within PersonalSpaceProvider');
  return ctx;
};
