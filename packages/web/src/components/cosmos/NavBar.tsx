// packages/web/src/components/cosmos/NavBar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { cn } from '@/lib/utils';
import { Compass, Briefcase, Brain, Disc, Heart, MessageSquare, Settings } from 'lucide-react';

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
  { id: 'life', label: 'Life', path: '/life', icon: Heart },
  { id: 'signal', label: 'Signal', path: '/signal', icon: MessageSquare },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center justify-center p-[var(--space-2)] z-[90] pointer-events-auto">
      <Glass 
        blur={24} 
        opacity={0.4} 
        className="flex gap-[var(--space-1)] p-[var(--space-1.5)] rounded-2xl border border-[var(--theme-border)] shadow-xl"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || 
            (tab.path !== '/' && location.pathname.startsWith(tab.path));

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive: linkActive }) => cn(
                "relative flex items-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] rounded-xl text-xs font-bold uppercase tracking-wider transition-all z-10",
                isActive 
                  ? "text-[var(--theme-primary)]" 
                  : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)]/20"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNavBarTab"
                  className="absolute inset-0 bg-[var(--theme-primary)]/10 rounded-xl border border-[var(--theme-primary)]/20 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </Glass>
    </nav>
  );
}
