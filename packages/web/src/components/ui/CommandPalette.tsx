// packages/web/src/components/ui/CommandPalette.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  action?: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  items: CommandItem[];
  placeholder?: string;
}

export function CommandPalette({ items, placeholder = 'Search commands...' }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) || 
      item.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
      setSearch('');
      setSelectedIndex(0);
    }
    
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setSearch('');
    }
    
    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item.path) { 
          navigate(item.path); 
          setIsOpen(false); 
        }
        if (item.action) { 
          item.action(); 
          setIsOpen(false); 
        }
      }
    }
  }, [isOpen, filteredItems, selectedIndex, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) { 
      document.body.style.overflow = 'hidden'; 
    } else { 
      document.body.style.overflow = ''; 
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 pointer-events-none"
          >
            <Glass 
              depth="modal" 
              blur={40} 
              opacity={0.12} 
              className="w-full max-w-2xl max-h-[80vh] overflow-hidden p-0 pointer-events-auto"
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-[var(--theme-text-secondary)] flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-[10px] bg-white/10 rounded font-bold text-white/40">ESC</kbd>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-[var(--theme-text-secondary)] text-sm italic">
                    No results found
                  </div>
                ) : (
                  filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all',
                        index === selectedIndex
                          ? 'bg-[var(--theme-primary)]/20 text-white'
                          : 'hover:bg-white/5 text-[var(--theme-text-secondary)]'
                      )}
                      onClick={() => {
                        if (item.path) { navigate(item.path); setIsOpen(false); }
                        if (item.action) { item.action(); setIsOpen(false); }
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <ArrowRight className={cn(
                        "w-4 h-4 transition-transform",
                        index === selectedIndex ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      )} />
                    </button>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-white/10 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                <span>{filteredItems.length} results</span>
                <span>⌘K to toggle</span>
              </div>
            </Glass>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
