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
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-[var(--space-6)] pointer-events-none">
      <Glass 
        blur={40} 
        opacity={0.8} 
        className="flex gap-[var(--space-1)] p-[var(--space-1)] rounded-full border border-[var(--theme-border)] shadow-2xl bg-[var(--theme-surface)]/80 backdrop-blur-md pointer-events-auto"
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
                "relative flex items-center justify-center h-11 w-11 rounded-full transition-all z-10",
                isActive 
                  ? "text-[var(--theme-primary)]" 
                  : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)]/40"
              )}
            >
              <Icon className="w-6 h-6" />
              {isActive && (
                <motion.div
                  layoutId="activeNavBarTab"
                  className="absolute inset-0 bg-[var(--theme-primary)]/20 rounded-full -z-10"
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
