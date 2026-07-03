/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { RealmId, Realm, realms } from './realms';

import { Variants } from 'framer-motion';

interface RealmContextType {
  realmId: RealmId;
  realm: Realm;
  setRealm: (id: RealmId) => void;
  realms: Realm[];
  isTransitioning: boolean;
  getMountAnimation: () => Variants;
}

const RealmContext = createContext<RealmContextType | undefined>(undefined);

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [realmId, setRealmId] = useState<RealmId>(() => {
    const saved = localStorage.getItem('cosmos-realm') as RealmId;
    return saved && realms.some(r => r.id === saved) ? saved : 'cyber-neon';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const realm = useMemo(() => {
    return realms.find(r => r.id === realmId) || realms[0];
  }, [realmId]);

  const getMountAnimation = useCallback((): Variants => {
    switch (realmId) {
      case 'cyber-neon':
        return {
          initial: { opacity: 0, scale: 0.9, filter: 'brightness(2) contrast(1.5)', boxShadow: '0 0 100px #00f0ff' },
          animate: { opacity: 1, scale: 1, filter: 'brightness(1) contrast(1)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' },
          exit: { opacity: 0, scale: 1.1, filter: 'brightness(3)', boxShadow: '0 0 200px #ff007f' }
        };
      case 'ironman-nano':
        return {
          initial: { opacity: 0, scale: 0.1, rotateX: 90, borderRadius: '100%' },
          animate: { opacity: 1, scale: 1, rotateX: 0, borderRadius: '4px' },
          exit: { opacity: 0, scale: 0.5, rotateX: -90, borderRadius: '100%' }
        };
      case 'venom-liquid':
        return {
          initial: { opacity: 0, scale: 1.2, borderRadius: '100%', filter: 'blur(20px)' },
          animate: { opacity: 1, scale: 1, borderRadius: '24px', filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.8, borderRadius: '50%', filter: 'blur(10px)' }
        };
      case 'retro-tape':
        return {
          initial: { opacity: 0, height: 0, y: -50, filter: 'grayscale(1)' },
          animate: { opacity: 1, height: 'auto', y: 0, filter: 'grayscale(0)' },
          exit: { opacity: 0, height: 0, y: 50, filter: 'grayscale(1)' }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  }, [realmId]);

  const handleSetRealm = useCallback((id: RealmId) => {
    if (id === realmId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setRealmId(id);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 800);
  }, [realmId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', realmId);
    document.documentElement.setAttribute('data-realm', realmId);
    localStorage.setItem('cosmos-realm', realmId);
  }, [realmId]);

  return (
    <RealmContext.Provider value={{ 
      realmId, 
      realm, 
      setRealm: handleSetRealm, 
      realms,
      isTransitioning,
      getMountAnimation
    }}>
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm() {
  const context = useContext(RealmContext);
  if (!context) throw new Error('useRealm must be used within RealmProvider');
  return context;
}
