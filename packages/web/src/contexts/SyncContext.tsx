/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

const SyncContext = createContext<any>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  return <SyncContext.Provider value={{}}>{children}</SyncContext.Provider>;
}

export const useSync = () => useContext(SyncContext);
