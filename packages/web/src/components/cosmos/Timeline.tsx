import React from 'react';
import { motion } from 'framer-motion';
import { useUniverse } from '@/lib/UniverseContext';
import { Label } from '@/components/aether/Typography';
import { Glass } from '@/components/aether/Glass';
import { History, Zap, Sparkles, AlertCircle, PlusCircle } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { history } = useUniverse();

  const getIcon = (type: string) => {
    switch (type) {
      case 'creation': return <PlusCircle size={14} />;
      case 'discovery': return <Sparkles size={14} />;
      case 'evolution': return <Zap size={14} />;
      case 'alert': return <AlertCircle size={14} />;
      default: return <History size={14} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'creation': return 'text-blue-400';
      case 'discovery': return 'text-emerald-400';
      case 'evolution': return 'text-purple-400';
      case 'alert': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <History className="text-[var(--theme-primary)] w-4 h-4" />
        <Label className="text-white/40 uppercase tracking-[0.2em] font-black text-[10px]">Universal Timeline</Label>
      </div>

      <Glass className="p-6 border-white/5 relative overflow-hidden min-h-[300px]">
        <div className="absolute left-8 top-12 bottom-12 w-px bg-white/5" />
        
        <div className="space-y-8 relative">
          {history.length === 0 && (
            <div className="text-center py-12 opacity-20 text-[10px] font-black uppercase tracking-widest">No history recorded</div>
          )}
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start group"
            >
              <div className={`relative z-10 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center ${getColor(entry.type)}`}>
                {getIcon(entry.type)}
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-white group-hover:text-[var(--theme-primary)] transition-colors">
                    {entry.title}
                  </span>
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${getColor(entry.type)} opacity-60`}>
                    {entry.type}
                  </span>
                  <span className="text-[8px] text-white/10 uppercase font-bold tracking-widest">•</span>
                  <span className="text-[8px] text-white/40 font-black uppercase tracking-widest">
                    {entry.realmId}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Glass>
    </div>
  );
};
