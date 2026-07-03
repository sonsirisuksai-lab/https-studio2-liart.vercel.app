/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../lib/db';

export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowContextState {
  windows: Record<string, WindowState>;
  registerWindow: (id: string, defaultState?: Partial<WindowState>) => void;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  bringToFront: (id: string) => void;
  loadWindows: () => Promise<void>;
}

const useWindowStore = create<WindowContextState>((set, get) => {
  const saveToDb = async (windows: Record<string, WindowState>) => {
    try {
      await db.entities.put({
        id: 'window-config',
        type: 'config',
        title: 'Window Configuration',
        content: windows,
        realm: 'system',
        tags: ['config', 'windows'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error('Failed to save window state to DB:', err);
    }
  };

  return {
    windows: {},
    registerWindow: (id, defaultState) => {
      set((state) => {
        if (state.windows[id]) return state; // Already registered
        
        const newWindows = {
          ...state.windows,
          [id]: {
            id,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            position: { x: 100, y: 100 },
            size: { width: 400, height: 300 },
            zIndex: Object.keys(state.windows).length + 10,
            ...defaultState,
          }
        };
        saveToDb(newWindows);
        return { windows: newWindows };
      });
    },
    updateWindow: (id, updates) => {
      set((state) => {
        if (!state.windows[id]) return state;
        const newWindows = {
          ...state.windows,
          [id]: { ...state.windows[id], ...updates }
        };
        saveToDb(newWindows);
        return { windows: newWindows };
      });
    },
    openWindow: (id) => get().updateWindow(id, { isOpen: true, isMinimized: false }),
    closeWindow: (id) => get().updateWindow(id, { isOpen: false }),
    toggleMinimize: (id) => {
      const win = get().windows[id];
      if (win) get().updateWindow(id, { isMinimized: !win.isMinimized });
    },
    toggleMaximize: (id) => {
      const win = get().windows[id];
      if (win) get().updateWindow(id, { isMaximized: !win.isMaximized });
    },
    bringToFront: (id) => {
      set((state) => {
        if (!state.windows[id]) return state;
        const maxZ = Math.max(0, ...Object.values(state.windows).map(w => w.zIndex));
        const newWindows = {
          ...state.windows,
          [id]: { ...state.windows[id], zIndex: maxZ + 1 }
        };
        saveToDb(newWindows);
        return { windows: newWindows };
      });
    },
    loadWindows: async () => {
      try {
        const entity = await db.entities.get('window-config');
        if (entity && entity.content) {
          set({ windows: entity.content });
        }
      } catch (err) {
        console.error('Failed to load window config:', err);
      }
    }
  };
});

const WindowContext = createContext<ReturnType<typeof useWindowStore> | null>(null);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const store = useWindowStore();
  
  useEffect(() => {
    store.loadWindows();
  }, []);

  return <WindowContext.Provider value={store}>{children}</WindowContext.Provider>;
}

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindow must be used within WindowProvider');
  return context;
};
