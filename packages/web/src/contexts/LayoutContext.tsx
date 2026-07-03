/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../lib/db';

interface Position {
  x: number;
  y: number;
}

interface LayoutState {
  windowPositions: Record<string, Position>;
  updatePosition: (id: string, pos: Position) => void;
  loadPositions: () => Promise<void>;
}

const useLayoutStore = create<LayoutState>((set, get) => ({
  windowPositions: {},
  updatePosition: (id, pos) => {
    set((state) => {
      const newPositions = { ...state.windowPositions, [id]: pos };
      // Save to Dexie asynchronously
      db.entities.put({
        id: 'layout-config',
        type: 'config',
        title: 'Layout Configuration',
        content: newPositions,
        realm: 'system',
        tags: ['config', 'layout'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }).catch(console.error);
      return { windowPositions: newPositions };
    });
  },
  loadPositions: async () => {
    try {
      const entity = await db.entities.get('layout-config');
      if (entity && entity.content) {
        set({ windowPositions: entity.content });
      }
    } catch (err) {
      console.error('Failed to load layout positions:', err);
    }
  }
}));

const LayoutContext = createContext<ReturnType<typeof useLayoutStore> | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const store = useLayoutStore();
  
  useEffect(() => {
    store.loadPositions();
  }, []);

  return <LayoutContext.Provider value={store}>{children}</LayoutContext.Provider>;
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within LayoutProvider');
  return context;
};
