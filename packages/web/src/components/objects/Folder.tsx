import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { FolderOpen, FileText } from 'lucide-react';

interface FolderProps {
  title: string;
  files: string[];
  onOpen?: () => void;
  className?: string;
}

export function Folder({ title, files, onOpen, className }: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playClick, playOpen, playClose } = useSound();

  const handleToggle = () => {
    if (isOpen) {
      playClose();
    } else {
      playOpen();
    }
    setIsOpen(!isOpen);
    if (!isOpen) onOpen?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggle}
      className={cn('relative w-48 cursor-pointer group', className)}
    >
      <div className="p-4 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
        <div className="flex items-center gap-2 mb-2">
          {isOpen ? (
            <FolderOpen className="w-5 h-5 text-amber-400/60" />
          ) : (
            <FolderOpen className="w-5 h-5 text-white/30" />
          )}
          <span className="text-xs font-medium text-white/60 truncate">{title}</span>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1 mt-2 pt-2 border-t border-[var(--theme-border)]"
            >
              {files.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                  }}
                >
                  <FileText className="w-3 h-3 text-white/20" />
                  <span className="text-[10px] text-white/40 truncate">{file}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-2 text-[8px] text-white/20">
          {isOpen ? '📂 Open' : '📁 Click to open'}
        </div>
      </div>
    </motion.div>
  );
}
