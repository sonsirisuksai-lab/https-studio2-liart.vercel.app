// src/components/RealmToggle.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { Palette, ChevronDown } from 'lucide-react';
import { Glass } from './aether/Glass';

const dropdownSpring = {
  type: 'spring',
  damping: 20,
  stiffness: 250,
  mass: 0.6,
};

export function RealmToggle() {
  const { realmId, realm, setRealm, realms } = useRealm();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 hover:border-[var(--theme-primary)]/40 transition-all flex items-center gap-2 text-[var(--theme-text)] cursor-pointer min-w-[160px] justify-between touch-manipulation"
        aria-label="Toggle Realm Menu"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Palette className="w-4 h-4" />
          <span className="text-sm font-bold">{realm.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 pointer-events-none ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={dropdownSpring}
            className="absolute right-0 mt-2 w-full min-w-[200px] z-[9999]"
          >
            <Glass className="p-2 border border-white/10 shadow-2xl flex flex-col gap-1 max-h-[350px] overflow-y-auto rounded-2xl">
              {realms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRealm(r.id);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-3 rounded-lg text-sm text-left transition-colors flex items-center gap-3 cursor-pointer touch-manipulation w-full active:bg-[var(--theme-primary)]/30 ${
                    realmId === r.id
                      ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-text)] font-bold border border-[var(--theme-primary)]/30'
                      : 'hover:bg-white/5 text-[var(--theme-text-secondary)] border border-transparent'
                  }`}
                >
                  <span className="text-xl leading-none pointer-events-none">{r.robin.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium pointer-events-none">{r.name}</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter">{r.id}</span>
                  </div>
                </button>
              ))}
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
