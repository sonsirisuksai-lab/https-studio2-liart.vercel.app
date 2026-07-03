// packages/web/src/components/cosmos/Breadcrumb.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map of URL paths to human-readable names
  const routeNameMap: Record<string, string> = {
    'work': 'Work Board',
    'think': 'Think Note',
    'studio': 'Studio',
    'life': 'Life & Wellness',
    'signal': 'Signal Chat',
    'money': 'Finance',
    'shortcuts': 'Shortcuts',
    'library': 'Library',
    'shopping': 'Shopping',
    'tracker': 'Tracker',
    'studio-pro': 'Studio Pro',
    'cookbook': 'Cookbook',
    'music-universe': 'Music',
    'ai-cards': 'AI Cards',
    'document-universe': 'Documents',
    'genetics-universe': 'Genetics',
    'workspace-universe': 'Workspace',
    'data-fusion': 'Data Fusion',
    'cinema': 'Cinema',
    'rewards': 'Rewards',
    'morning-dashboard': 'Morning Hub',
    'creative-studio': 'Creative',
    'food-delivery': 'Food Delivery',
    'playful-widgets': 'Widgets',
    'disc-player': 'Disc Player',
    'retro-inventory': 'Retro Inventory',
    'skeuomorphic': 'Skeuomorphic',
    'news-stack': 'News Stack',
    'plugins': 'Plugins',
    'marketplace': 'Marketplace',
    'media-hub': 'Media Hub',
    'workspace-core': 'Workspace Core',
    'ai-center': 'AI Center',
    'archive': 'Archive',
    'logistics': 'Logistics',
    'personal-space': 'Personal Space',
    'login': 'Login',
    'register': 'Register'
  };

  return (
    <nav className="flex items-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] bg-[var(--theme-surface)]/10 border border-[var(--theme-border)]/50 rounded-xl text-xs font-medium text-[var(--theme-text-secondary)] backdrop-blur-md w-fit mb-[var(--space-4)] z-50">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-[var(--theme-primary)] transition-colors"
        aria-label="Navigate to Nexus Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="font-bold uppercase tracking-wider text-[10px]">Nexus</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 opacity-40 shrink-0 text-[var(--theme-text-secondary)]" />
            {last ? (
              <span className="font-bold text-[var(--theme-primary)] uppercase tracking-wider text-[10px] truncate max-w-[120px] md:max-w-xs">
                {name}
              </span>
            ) : (
              <Link 
                to={to} 
                className="hover:text-[var(--theme-primary)] transition-colors font-bold uppercase tracking-wider text-[10px] truncate max-w-[100px]"
                aria-label={`Navigate to ${name}`}
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
