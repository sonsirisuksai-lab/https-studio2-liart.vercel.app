// packages/web/src/components/cosmos/BottomNav.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { cn } from '@/lib/utils';
import { Compass, Briefcase, Brain, Disc, Settings } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const TABS: TabItem[] = [
  { id: 'nexus', label: 'Nexus', path: '/', icon: Compass },
  { id: 'work', label: 'Work', path: '/work', icon: Briefcase },
  { id: 'think', label: 'Think', path: '/think', icon: Brain },
  { id: 'studio', label: 'Studio', path: '/studio', icon: Disc },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[120] p-[var(--space-3)] md:hidden pointer-events-none">
      <Glass
        blur={40}
        opacity={0.8}
        className="max-w-lg mx-auto flex justify-between items-center px-[var(--space-4)] py-[var(--space-2)] rounded-full border border-[var(--theme-border)] shadow-2xl pointer-events-auto"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || 
            (tab.path !== '/' && location.pathname.startsWith(tab.path));

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={cn(
                "relative flex flex-col items-center gap-[var(--space-1)] py-[var(--space-1)] px-[var(--space-3)] rounded-xl transition-all",
                isActive 
                  ? "text-[var(--theme-primary)]" 
                  : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeBottomNavTab"
                  className="absolute inset-0 bg-[var(--theme-primary)]/10 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </Glass>
    </div>
  );
}
