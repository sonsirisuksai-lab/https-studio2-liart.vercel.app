import React from 'react';
import { motion } from 'framer-motion';
import { useUniverse } from '@/lib/UniverseContext';
import { Label } from '@/components/aether/Typography';
import { Glass } from '@/components/aether/Glass';
import { Plus, Mic, Image, Clipboard, FileText, Music, Lightbulb } from 'lucide-react';

export const QuickCapture: React.FC = () => {
  const { dispatch } = useUniverse();

  const captureMethods = [
    { id: 'idea', icon: <Lightbulb size={20} />, label: 'Idea', color: 'text-amber-400' },
    { id: 'voice', icon: <Mic size={20} />, label: 'Voice', color: 'text-rose-400' },
    { id: 'image', icon: <Image size={20} />, label: 'Image', color: 'text-emerald-400' },
    { id: 'clipboard', icon: <Clipboard size={20} />, label: 'Clip', color: 'text-blue-400' },
    { id: 'file', icon: <FileText size={20} />, label: 'File', color: 'text-purple-400' },
    { id: 'music', icon: <Music size={20} />, label: 'Audio', color: 'text-cyan-400' },
  ];

  const handleCapture = () => {
    dispatch('CAPTURE_INITIATED');
    setTimeout(() => {
      dispatch('CAPTURE_COMPLETED');
    }, 2000);
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <Label className="px-2 text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em] font-black text-[10px]">Universal Capture</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[var(--space-4)]">
        {captureMethods.map((method) => (
          <motion.button
            key={method.id}
            onClick={handleCapture}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <Glass className="p-[var(--space-5)] flex flex-col items-center justify-center gap-[var(--space-3)] border-[var(--theme-border)] hover:border-[var(--theme-primary)]/40 transition-all aspect-square lg:aspect-auto lg:h-32">
              <div className={`${method.color} group-hover:scale-110 transition-transform`}>
                {method.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] group-hover:text-[var(--theme-text)] transition-colors">
                {method.label}
              </span>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={10} className="text-[var(--theme-text-tertiary)]/30" />
              </div>
            </Glass>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
