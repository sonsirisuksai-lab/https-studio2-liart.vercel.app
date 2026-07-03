import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MakaPrompt } from '@/components/cosmos/MakaPrompt';
import CommandBridge from '@/components/cosmos/CommandBridge';
import { useRealm } from '@/lib/RealmContext';
import { useUniverse } from '@/lib/UniverseContext';
import { WindowManager } from '@/components/window/WindowManager';
import { RobinCompanion } from '@/components/cosmos/RobinCompanion';
import { PortalTransition } from '@/components/cosmos/PortalTransition';
import { checkSessionTimeout } from '@/lib/session-security';
import { MatrixOverlay } from '@/components/cosmos/MatrixOverlay';
import { UniversalSearch } from '@/components/cosmos/UniversalSearch';

// A calm, Apple-inspired page transition: gentle fade + short lift, no blur churn.
const pageTransition = {
  type: 'spring',
  damping: 30,
  stiffness: 260,
  mass: 0.6,
} as const;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { realmId } = useRealm();
  const { universeState } = useUniverse();

  useEffect(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity && checkSessionTimeout(parseInt(lastActivity))) {
      localStorage.removeItem('lastActivity');
      navigate('/login');
    }
    localStorage.setItem('lastActivity', Date.now().toString());
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] font-sans antialiased transition-colors duration-500 selection:bg-[var(--theme-primary)] selection:text-white"
      data-theme={realmId}
      data-realm={realmId}
    >
      {/* Single, soft ambient light — subtle depth without visual noise. */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[var(--theme-primary)] opacity-[0.06] blur-[160px] rounded-full" />
      </div>

      {/* Intelligent overlays (functional, non-visual-noise) */}
      <MakaPrompt />
      <CommandBridge />
      <RobinCompanion />
      <PortalTransition />
      <UniversalSearch />

      <AnimatePresence>
        {universeState !== 'idle' && <MatrixOverlay />}
      </AnimatePresence>

      {/* Workspace content — generous whitespace lets pages breathe. */}
      <main className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-24 pb-28 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={pageTransition}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <WindowManager />
    </div>
  );
}
