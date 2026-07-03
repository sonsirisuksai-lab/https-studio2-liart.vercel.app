/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from 'react';

export type DocMode = 'docs' | 'code' | 'projects';
export type DocType = 'pdf' | 'md' | 'txt' | 'word';

interface DocumentCoreState {
  activeMode: DocMode;
  setActiveMode: (mode: DocMode) => void;
  docType: DocType;
  setDocType: (type: DocType) => void;
}

const DocumentCoreContext = createContext<DocumentCoreState | undefined>(undefined);

export const DocumentCoreProvider: React.FC<{children: React.ReactNode}> = React.memo(({ children }) => {
  const [activeMode, setActiveMode] = useState<DocMode>('docs');
  const [docType, setDocType] = useState<DocType>('pdf');

  const value = useMemo(() => ({ activeMode, setActiveMode, docType, setDocType }), [activeMode, docType]);

  return <DocumentCoreContext.Provider value={value}>{children}</DocumentCoreContext.Provider>;
});

export const useDocumentCore = () => {
  const ctx = useContext(DocumentCoreContext);
  if (!ctx) throw new Error('useDocumentCore must be used within DocumentCoreProvider');
  return ctx;
};
