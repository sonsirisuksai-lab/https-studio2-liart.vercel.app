import React from 'react';
import { useRealm } from '@/lib/RealmContext';
import { Label } from '@/components/aether/Typography';
import { motion } from 'framer-motion';

export const ThemeSelector = () => {
  const { realms, setRealm, realmId, isTransitioning } = useRealm();
  
  return (
    <div className="flex flex-col gap-4 p-6 bg-[var(--theme-surface)]/40 backdrop-blur-2xl border border-[var(--theme-text)]/10 rounded-xl">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] uppercase tracking-[0.25em] text-[var(--theme-text)]/50 font-black">Bridge Core</Label>
        {isTransitioning && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3 h-3 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full" />}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {realms.map((r) => (
          <motion.button
            key={r.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRealm(r.id)}
            className={`relative group aspect-square flex items-center justify-center text-xl transition-all duration-300 rounded-lg ${
              realmId === r.id 
                ? 'bg-[var(--theme-primary)] text-[var(--theme-background)] shadow-[0_0_15px_var(--theme-primary)]' 
                : 'bg-[var(--theme-text)]/5 text-[var(--theme-text)]/30 hover:bg-[var(--theme-text)]/10'
            }`}
          >
            {r.icon}
            {realmId === r.id && (
              <motion.div layoutId="active-ring" className="absolute inset-0 border-2 border-white/20 rounded-lg" />
            )}
            <span className="absolute -bottom-6 text-[8px] opacity-0 group-hover:opacity-100 uppercase tracking-wider font-bold text-[var(--theme-text)] pointer-events-none">
              {r.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
