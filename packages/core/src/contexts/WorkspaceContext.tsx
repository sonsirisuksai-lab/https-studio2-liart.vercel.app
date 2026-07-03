import { createContext, ReactNode, useState } from 'react';

export interface WorkspaceContextType {
  workspace: string;
  setWorkspace: (ws: string) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState('default');
  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
