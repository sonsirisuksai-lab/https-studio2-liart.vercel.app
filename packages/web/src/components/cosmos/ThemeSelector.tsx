import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { Glass } from '@/components/aether/Glass';
import { engine } from "@/lib/audio-engine";
import { Volume2, VolumeX } from "lucide-react";

export function ThemeSelector() {
  const { realmId, setRealm, realms } = useRealm();
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(engine.getEnabled());

  const toggleAudio = () => {
    setAudioEnabled(engine.toggle());
  };

  const activeRealm = realms.find(r => r.id === realmId);

  return (
    <div className="flex items-center gap-[var(--space-2)] pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--theme-surface)]/40 border border-[var(--theme-border)] hover:border-[var(--theme-primary)]/40 transition-colors text-[var(--theme-text-secondary)]"
      >
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </motion.button>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-[var(--space-2)] px-3 py-1.5 rounded-full bg-[var(--theme-surface)]/40 border border-[var(--theme-border)] hover:border-[var(--theme-primary)]/40 transition-colors"
        >
          <span className="text-sm">{activeRealm?.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/85">
            {activeRealm?.name}
          </span>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 z-50"
            >
              <Glass className="p-[var(--space-2)] rounded-2xl flex flex-col gap-[var(--space-1)] bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-2xl">
                {realms.map((realm) => (
                  <button
                    key={realm.id}
                    onClick={() => {
                      setRealm(realm.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)] rounded-xl transition-all ${
                      realmId === realm.id
                        ? 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]'
                        : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-glass)] hover:text-[var(--theme-text)]'
                    }`}
                  >
                    <span className="text-lg">{realm.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-wider">{realm.name}</span>
                    </div>
                  </button>
                ))}
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
