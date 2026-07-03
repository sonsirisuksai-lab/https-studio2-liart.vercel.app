/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../lib/db';

export interface PluginState {
  id: string;
  name: string;
  isActive: boolean;
  version: string;
}

interface PluginContextState {
  plugins: Record<string, PluginState>;
  registerPlugin: (plugin: PluginState) => void;
  togglePlugin: (id: string) => void;
  loadPlugins: () => Promise<void>;
}

const usePluginStore = create<PluginContextState>((set, get) => {
  const saveToDb = async (plugins: Record<string, PluginState>) => {
    try {
      await db.entities.put({
        id: 'plugin-config',
        type: 'config',
        title: 'Plugin Configuration',
        content: plugins,
        realm: 'system',
        tags: ['config', 'plugins'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error('Failed to save plugin config:', err);
    }
  };

  return {
    plugins: {},
    registerPlugin: (plugin) => {
      set((state) => {
        if (state.plugins[plugin.id]) return state; // Already registered
        const newPlugins = { ...state.plugins, [plugin.id]: plugin };
        saveToDb(newPlugins);
        return { plugins: newPlugins };
      });
    },
    togglePlugin: (id) => {
      set((state) => {
        if (!state.plugins[id]) return state;
        const newPlugins = {
          ...state.plugins,
          [id]: { ...state.plugins[id], isActive: !state.plugins[id].isActive }
        };
        saveToDb(newPlugins);
        return { plugins: newPlugins };
      });
    },
    loadPlugins: async () => {
      try {
        const entity = await db.entities.get('plugin-config');
        if (entity && entity.content) {
          set({ plugins: entity.content });
        }
      } catch (err) {
        console.error('Failed to load plugins from DB:', err);
      }
    }
  };
});

const PluginContext = createContext<ReturnType<typeof usePluginStore> | null>(null);

export function PluginProvider({ children }: { children: React.ReactNode }) {
  const store = usePluginStore();
  
  useEffect(() => {
    store.loadPlugins();
  }, []);

  return <PluginContext.Provider value={store}>{children}</PluginContext.Provider>;
}

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (!context) throw new Error('usePlugins must be used within PluginProvider');
  return context;
};
