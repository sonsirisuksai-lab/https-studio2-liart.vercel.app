import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRobin } from '@/lib/RobinContext';
import { Command, Sparkles } from 'lucide-react';

export const MakaPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const { say } = useRobin();

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-maka-prompt', handler);
    return () => window.removeEventListener('open-maka-prompt', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      say(`รับทราบครับ บอส: ${command}`);
      setCommand('');
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0A0A0A] p-8 rounded-[32px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent opacity-50" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                <Command size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">AI Command Bridge</h2>
                <p className="text-xs text-white/20 font-black uppercase tracking-widest mt-1">Direct Neural Link Established</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-lg font-bold focus:outline-none focus:border-[var(--theme-primary)]/50 focus:ring-4 focus:ring-[var(--theme-primary)]/10 transition-all placeholder:text-white/10"
                placeholder="What is your command, Boss?"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-[var(--theme-primary)] text-white hover:scale-110 transition-transform shadow-[0_0_20px_var(--theme-glow)]"
              >
                <Sparkles size={20} />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Robin Core v4.2
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/20 uppercase">Press ENTER to execute</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
