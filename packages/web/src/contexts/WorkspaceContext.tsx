/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../lib/db';

interface WorkspaceState {
  activeWorkspace: string;
  setWorkspace: (id: string) => void;
  loadWorkspace: () => Promise<void>;
}

const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: 'default',
  setWorkspace: (id) => {
    set({ activeWorkspace: id });
    db.entities.put({
      id: 'workspace-config',
      type: 'config',
      title: 'Workspace Configuration',
      content: { activeWorkspace: id },
      realm: 'system',
      tags: ['config', 'workspace'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }).catch(console.error);
  },
  loadWorkspace: async () => {
    try {
      const entity = await db.entities.get('workspace-config');
      if (entity && entity.content?.activeWorkspace) {
        set({ activeWorkspace: entity.content.activeWorkspace });
      }
    } catch (err) {
      console.error('Failed to load workspace config:', err);
    }
  }
}));

const WorkspaceContext = createContext<ReturnType<typeof useWorkspaceStore> | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const store = useWorkspaceStore();
  
  useEffect(() => {
    store.loadWorkspace();
  }, []);

  return <WorkspaceContext.Provider value={store}>{children}</WorkspaceContext.Provider>;
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
};
