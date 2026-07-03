import React from 'react';
import { motion } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { useUniverse } from '@/lib/UniverseContext';
import { Glass } from '@/components/aether/Glass';

export type ObjectType = 
  | 'mission' 
  | 'project' 
  | 'knowledge' 
  | 'idea' 
  | 'memory' 
  | 'file' 
  | 'vinyl' 
  | 'cassette' 
  | 'soul-card' 
  | 'orb' 
  | 'crystal' 
  | 'scroll';

interface PhysicalObjectProps {
  type: ObjectType;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const PhysicalObject: React.FC<PhysicalObjectProps> = ({ 
  type, 
  title, 
  subtitle, 
  icon, 
  onClick,
  className = "" 
}) => {
  const { realmId } = useRealm();
  const { dispatch, isUniverseStable, universeState } = useUniverse();

  // Realm-specific Object Visuals
  const getObjectVisual = () => {
    // New global types
    if (type === 'vinyl') return '💿';
    if (type === 'cassette') return '📼';
    if (type === 'soul-card') return '🃏';
    if (type === 'orb') return '🔮';
    if (type === 'crystal') return '💎';
    if (type === 'scroll') return '📜';

    switch (realmId) {
      case 'retro-tape':
        if (type === 'file') return '📼';
        if (type === 'knowledge') return '📖';
        if (type === 'mission') return '📻';
        return '📁';
      case 'ironman-nano':
        if (type === 'mission') return '🧳';
        if (type === 'project') return '📦';
        if (type === 'file') return '🔩';
        return '⚙️';
      case 'venom-liquid':
        if (type === 'knowledge') return '🌑';
        if (type === 'memory') return '🔮';
        if (type === 'idea') return '⚫';
        return '〰';
      case 'cyber-neon':
        if (type === 'memory') return '💠';
        if (type === 'idea') return '⚡';
        return '🛸';
      default:
        return '🛸';
    }
  };

  const visual = getObjectVisual();
  const { energy } = useUniverse();
  const energyLevel = Math.max(0.2, energy / 100);

  return (
    <motion.div
      animate={{
        x: !isUniverseStable ? [0, -2, 2, -1, 1, 0] : 0,
        y: !isUniverseStable ? [0, 1, -1, 0.5, -0.5, 0] : 0,
        filter: !isUniverseStable ? `contrast(1.2) brightness(1.1) drop-shadow(0 0 ${10 * (1 - energyLevel)}px var(--theme-primary))` : 'none'
      }}
      transition={{ 
        repeat: !isUniverseStable ? Infinity : 0, 
        duration: 0.2 
      }}
      whileHover={{ 
        scale: 1.05 + (energyLevel * 0.05), 
        y: -10,
        rotateY: realmId === 'ironman-nano' ? 5 : 0,
        rotateX: realmId === 'venom-liquid' ? -5 : 0,
        boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 ${20 * energyLevel}px var(--theme-primary)`
      }}
      onHoverStart={() => dispatch('OBJECT_TOUCHED', { type, title })}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group cursor-pointer perspective-1000 ${className}`}
    >
      <Glass 
        className="relative p-6 flex flex-col gap-4 overflow-hidden border-white/10 group-hover:border-[var(--theme-primary)]/40 transition-all duration-500"
        style={{ 
          borderRadius: realmId === 'ironman-nano' ? '0px' : realmId === 'venom-liquid' ? '40px' : '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}
      >
        {/* Material Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-3xl shadow-inner">
            {icon || visual}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-[var(--theme-primary)] transition-colors">
            {type}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-white leading-tight group-hover:translate-x-1 transition-transform">{title}</h3>
          {subtitle && (
            <p className="text-xs text-white/40 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        {/* Action Indicators */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: !isUniverseStable ? '100%' : '40%',
                backgroundColor: !isUniverseStable ? 'var(--theme-primary)' : 'rgba(255,255,255,0.2)'
              }}
              className="h-full"
            />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-tighter ${!isUniverseStable ? 'text-[var(--theme-primary)] animate-pulse' : 'text-white/20'}`}>
            {universeState === 'shifting' ? 'Syncing...' : isUniverseStable ? 'Locked' : 'Processing'}
          </span>
        </div>

        {/* Hover Glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--theme-primary)]/20 blur-3xl rounded-full group-hover:opacity-100 opacity-0 transition-opacity" />
      </Glass>
    </motion.div>
  );
};
