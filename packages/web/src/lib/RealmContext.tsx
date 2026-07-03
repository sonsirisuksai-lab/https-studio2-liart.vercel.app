/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { RealmId, Realm, realms } from './realms';

interface RealmContextType {
  realmId: RealmId;
  realm: Realm;
  setRealm: (id: RealmId) => void;
  realms: Realm[];
  isTransitioning: boolean;
}

const RealmContext = createContext<RealmContextType | undefined>(undefined);

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [realmId, setRealmId] = useState<RealmId>(() => {
    const saved = localStorage.getItem('cosmos-realm') as RealmId;
    return saved && realms.some(r => r.id === saved) ? saved : 'starlight';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const realm = useMemo(() => {
    return realms.find(r => r.id === realmId) || realms[0];
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
      isTransitioning 
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
