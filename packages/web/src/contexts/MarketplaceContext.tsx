/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../lib/db';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  isInstalled: boolean;
}

interface MarketplaceContextState {
  items: Record<string, MarketplaceItem>;
  installItem: (id: string) => void;
  uninstallItem: (id: string) => void;
  loadItems: () => Promise<void>;
}

const useMarketplaceStore = create<MarketplaceContextState>((set, get) => {
  const saveToDb = async (items: Record<string, MarketplaceItem>) => {
    try {
      await db.entities.put({
        id: 'marketplace-config',
        type: 'config',
        title: 'Marketplace Configuration',
        content: items,
        realm: 'system',
        tags: ['config', 'marketplace'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error('Failed to save marketplace config:', err);
    }
  };

  return {
    items: {},
    installItem: (id) => {
      set((state) => {
        if (!state.items[id]) return state;
        const newItems = {
          ...state.items,
          [id]: { ...state.items[id], isInstalled: true }
        };
        saveToDb(newItems);
        return { items: newItems };
      });
    },
    uninstallItem: (id) => {
      set((state) => {
        if (!state.items[id]) return state;
        const newItems = {
          ...state.items,
          [id]: { ...state.items[id], isInstalled: false }
        };
        saveToDb(newItems);
        return { items: newItems };
      });
    },
    loadItems: async () => {
      try {
        const entity = await db.entities.get('marketplace-config');
        if (entity && entity.content) {
          set({ items: entity.content });
        } else {
          // Setup defaults
          const defaultItems: Record<string, MarketplaceItem> = {
            'theme-pack-1': {
              id: 'theme-pack-1',
              title: 'Cosmic Theme Pack',
              description: 'A set of dark aesthetic themes.',
              author: 'Zoro',
              price: 0,
              isInstalled: false
            }
          };
          set({ items: defaultItems });
        }
      } catch (err) {
        console.error('Failed to load marketplace from DB:', err);
      }
    }
  };
});

const MarketplaceContext = createContext<ReturnType<typeof useMarketplaceStore> | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const store = useMarketplaceStore();
  
  useEffect(() => {
    store.loadItems();
  }, []);

  return <MarketplaceContext.Provider value={store}>{children}</MarketplaceContext.Provider>;
}

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
