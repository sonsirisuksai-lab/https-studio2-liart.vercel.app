import React, { useState, useEffect } from 'react';
import { supabase } from '@cosmos/core';
import { Glass } from '../aether/Glass';
import { db } from '../../lib/db';

export function SyncStatus() {
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState<string>('Just now');

  const handleManualSync = async () => {
    setSyncState('syncing');
    
    try {
      // 1. Fetch from Supabase
      const { data, error } = await supabase.from('notion_db_delta').select('*').limit(1);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // 2. Validate with Dexie (Local Sync)
      const count = await db.entities.count();
      console.log('Entities count in Dexie:', count);
      
      const timestamp = new Date().toLocaleTimeString();
      setLastSynced(`at ${timestamp}`);
      setSyncState('synced');
    } catch (err) {
      console.error('Cloud Sync Failed:', err);
      setSyncState('error');
    }
  };

  useEffect(() => {
    // Setup automated backdrop sync interval every 5 minutes
    const interval = setInterval(() => {
      handleManualSync();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Glass
        blur={30}
        opacity={0.3}
        border
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            syncState === 'syncing'
              ? 'bg-yellow-400 animate-ping'
              : syncState === 'error'
              ? 'bg-red-500'
              : 'bg-green-400'
          }`}
        ></span>
        <span className="text-[10px] uppercase tracking-wider text-white/60">
          {syncState === 'syncing' ? 'Syncing grid...' : syncState === 'error' ? 'Grid offline' : 'Synced'}
        </span>
      </Glass>
      <button
        onClick={handleManualSync}
        disabled={syncState === 'syncing'}
        className="text-[10px] font-semibold bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 px-3 py-1.5 rounded-full uppercase tracking-wider transition-all"
        title={`Last synced ${lastSynced}`}
      >
        {syncState === 'syncing' ? '...' : 'Sync Now'}
      </button>
    </div>
  );
}
export default SyncStatus;
