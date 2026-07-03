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
    <div className="flex items-center gap-2 pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-colors text-white/70"
      >
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </motion.button>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-colors"
        >
          <span className="text-sm">{activeRealm?.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
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
              <Glass className="p-2 rounded-2xl flex flex-col gap-1 bg-black/60 backdrop-blur-2xl border-white/10 shadow-2xl">
                {realms.map((realm) => (
                  <button
                    key={realm.id}
                    onClick={() => {
                      setRealm(realm.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                      realmId === realm.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
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
