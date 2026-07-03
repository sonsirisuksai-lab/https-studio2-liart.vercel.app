import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, Database, Layers, Sparkles, Clock } from 'lucide-react';
import { Glass } from '@/components/aether/Glass';

export const UniversalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-universal-search', handleOpen);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-universal-search', handleOpen);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl relative"
          >
            <Glass className="overflow-hidden border-white/10 shadow-2xl">
              <div className="p-6 flex items-center gap-4 border-b border-white/5">
                <Search className="text-[var(--theme-primary)] w-5 h-5" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the Universe..."
                  className="bg-transparent border-none outline-none flex-1 text-lg font-bold text-white placeholder:text-white/20"
                />
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-white/5 rounded border border-white/5 text-[9px] font-mono text-white/40">ESC</div>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {query.length === 0 ? (
                  <div className="p-8 text-center space-y-4">
                    <Command className="mx-auto text-white/10 w-12 h-12" />
                    <div>
                      <p className="text-sm font-black text-white/40 uppercase tracking-widest">Search Engine Ready</p>
                      <p className="text-xs text-white/20 mt-1">Search for artifacts, knowledge clusters, missions, or crew updates.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {[
                      { id: '1', title: 'Neural Fragment 09', type: 'Artifact', icon: <Sparkles size={14} /> },
                      { id: '2', title: 'Quantum Grid Logic', type: 'Knowledge', icon: <Database size={14} /> },
                      { id: '3', title: 'Mission: Starlight', type: 'Mission', icon: <Layers size={14} /> },
                      { id: '4', title: 'Recent Broadcast', type: 'History', icon: <Clock size={14} /> },
                    ].map((result) => (
                      <button
                        key={result.id}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 text-[var(--theme-primary)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-all">
                          {result.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[var(--theme-primary)] transition-colors">{result.title}</p>
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{result.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                   <div className="flex items-center gap-1">
                     <span className="text-[9px] font-mono text-white/20 uppercase">↑↓ to navigate</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="text-[9px] font-mono text-white/20 uppercase">↵ to select</span>
                   </div>
                </div>
                <div className="text-[10px] font-black text-[var(--theme-primary)] uppercase tracking-tighter">COSMOS Search v1.0</div>
              </div>
            </Glass>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
