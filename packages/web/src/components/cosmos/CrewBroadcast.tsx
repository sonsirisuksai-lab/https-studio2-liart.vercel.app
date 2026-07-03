import React from 'react';
import { motion } from 'framer-motion';
import { useUniverse } from '@/lib/UniverseContext';
import { Label } from '@/components/aether/Typography';
import { Glass } from '@/components/aether/Glass';
import { Clock, MessageCircle, Zap, ShieldCheck } from 'lucide-react';

export const CrewBroadcast: React.FC = () => {
  const { broadcasts } = useUniverse();

  return (
    <div className="space-y-[var(--space-4)]">
      <div className="flex items-center justify-between px-[var(--space-2)]">
        <Label className="text-[var(--theme-text-tertiary)] uppercase tracking-[0.2em] font-black text-[10px]">Crew Broadcast</Label>
        <div className="flex items-center gap-[var(--space-2)]">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase">Live Feed</span>
        </div>
      </div>

      <div className="space-y-[var(--space-3)]">
        {broadcasts.length === 0 && (
          <div className="text-center py-8 opacity-20 text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)]">No recent updates</div>
        )}
        {broadcasts.map((broadcast, i) => (
          <motion.div
            key={broadcast.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Glass className="p-[var(--space-4)] border-[var(--theme-border)] hover:border-[var(--theme-primary)]/20 transition-all group">
              <div className="flex gap-[var(--space-4)]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  broadcast.type === 'discovery' ? 'bg-purple-500/20 text-purple-400' :
                  broadcast.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {broadcast.type === 'discovery' ? <Zap size={14} /> :
                   broadcast.type === 'alert' ? <ShieldCheck size={14} /> :
                   <MessageCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-[var(--theme-text-secondary)] uppercase">{broadcast.sender}</span>
                    <div className="flex items-center gap-1 text-[9px] text-[var(--theme-text-tertiary)] font-mono">
                      <Clock size={8} />
                      {new Date(broadcast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] font-medium leading-relaxed truncate group-hover:text-[var(--theme-text)] transition-colors">
                    {broadcast.message}
                  </p>
                </div>
              </div>
            </Glass>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
