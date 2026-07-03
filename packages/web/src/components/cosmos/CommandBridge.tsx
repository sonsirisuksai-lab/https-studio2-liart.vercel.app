import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Zap, Search, Mic, Command, Settings,
  Database, RefreshCw, Layers, Box, Maximize2, Activity,
  Sparkles, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealm } from '@/lib/RealmContext';
import { useUniverse } from '@/lib/UniverseContext';
import { useRobin } from '@/lib/RobinContext';

const CommandBridge = () => {
  const navigate = useNavigate();
  const { realmId, realm, setRealm, realms } = useRealm();
  const { energy, universeState, isUniverseStable, restoreSystem, evolveSystem, evolutionLevel } = useUniverse();
  const { say } = useRobin();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'thinking' | 'analyzing'>('idle');
  const systemHealth = Math.floor(energy);

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: ('idle' | 'thinking' | 'analyzing')[] = ['idle', 'thinking', 'analyzing'];
      setAiStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusLabel =
    universeState === 'shifting' ? 'Evolving' :
    universeState === 'restoring' ? 'Restoring' :
    aiStatus === 'thinking' ? 'Thinking' :
    aiStatus === 'analyzing' ? 'Analyzing' :
    'All systems operational';

  return (
    <>
      {/* ─── TOP BAR ─── */}
      <header className="fixed top-0 inset-x-0 z-[100] border-b border-[var(--theme-text)]/10 bg-[var(--theme-background)]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-6 lg:px-10">

          {/* Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 shrink-0 group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--theme-primary)]/15 text-lg transition-transform group-hover:scale-105">
              {realm.robin.icon}
            </span>
            <span className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-sm font-semibold tracking-tight text-[var(--theme-text)]">Cosmos</span>
              <span className="text-[11px] font-medium text-[var(--theme-text)]/45">{realm.name}</span>
            </span>
          </button>

          {/* Command input */}
          <div className="flex-1 flex justify-center">
            <div className="flex w-full max-w-md items-center gap-2.5 rounded-full border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.04] px-4 py-2 transition-colors focus-within:border-[var(--theme-primary)]/40">
              <Command className="h-4 w-4 text-[var(--theme-text)]/35" />
              <input
                type="text"
                aria-label="Command"
                placeholder={`Ask or command \u00B7 ${realm.name}`}
                className="w-full bg-transparent text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text)]/35"
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      say(`\u0e23\u0e31\u0e1a\u0e17\u0e23\u0e32\u0e1a\u0e04\u0e23\u0e31\u0e1a \u0e1a\u0e2d\u0e2a: ${val}`);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <kbd className="hidden md:inline text-[10px] font-medium text-[var(--theme-text)]/35">⌘K</kbd>
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* System status */}
            <div className="hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isUniverseStable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="text-xs font-medium text-[var(--theme-text)]/60">{statusLabel}</span>
              <span className="text-xs font-medium text-[var(--theme-text)]/35 tabular-nums">{systemHealth}%</span>
            </div>

            {/* Realm switcher */}
            <div className="hidden md:flex items-center gap-0.5 rounded-full border border-[var(--theme-text)]/10 p-0.5">
              {realms.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRealm(r.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    realmId === r.id
                      ? 'bg-[var(--theme-primary)] text-white'
                      : 'text-[var(--theme-text)]/50 hover:text-[var(--theme-text)]'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <IconButton
              label="Search"
              onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
            >
              <Search className="h-4 w-4" />
            </IconButton>
            <IconButton label="Voice" onClick={() => say('\u0e01\u0e33\u0e25\u0e31\u0e07\u0e1f\u0e31\u0e07\u0e2d\u0e22\u0e39\u0e48\u0e04\u0e23\u0e31\u0e1a \u0e1a\u0e2d\u0e2a...')}>
              <Mic className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Menu"
              active={isConsoleOpen}
              onClick={() => setIsConsoleOpen((v) => !v)}
            >
              <Compass className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* ─── COMMAND CONSOLE ─── */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-[var(--theme-background)]/60 p-4 pt-24 backdrop-blur-2xl"
            onClick={() => setIsConsoleOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[var(--theme-text)]/10 bg-[var(--theme-background)]/95 shadow-2xl"
            >
              {/* Console header */}
              <div className="flex items-center justify-between border-b border-[var(--theme-text)]/10 px-7 py-5">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-[var(--theme-text)]">Mission Control</h2>
                  <p className="mt-0.5 text-sm text-[var(--theme-text)]/50">Modules and system orchestration</p>
                </div>
                <button
                  onClick={() => setIsConsoleOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--theme-text)]/50 transition-colors hover:bg-[var(--theme-text)]/5 hover:text-[var(--theme-text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* System summary */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-[var(--theme-text)]/10 px-7 py-5">
                <SummaryStat icon={<Activity className="h-4 w-4" />} label="Health" value={`${systemHealth}%`} />
                <SummaryStat icon={<Layers className="h-4 w-4" />} label="Realm" value={realm.name} />
                <SummaryStat
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Vanguard"
                  value={`v${evolutionLevel}.0 · ${isUniverseStable ? 'Stable' : 'Active'}`}
                />
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={evolveSystem}
                    className="flex items-center gap-2 rounded-full bg-[var(--theme-text)]/5 px-4 py-2 text-sm font-medium text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-text)]/10"
                  >
                    <Sparkles className="h-4 w-4" /> Evolve
                  </button>
                  <button
                    onClick={restoreSystem}
                    className="flex items-center gap-2 rounded-full bg-[var(--theme-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <RefreshCw className={`h-4 w-4 ${universeState === 'restoring' ? 'animate-spin' : ''}`} /> Restore
                  </button>
                </div>
              </div>

              {/* Module grid */}
              <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
                {[
                  { id: '', icon: <Compass className="h-5 w-5" />, label: 'Nexus' },
                  { id: 'studio', icon: <Mic className="h-5 w-5" />, label: 'Studio' },
                  { id: 'creative-studio', icon: <Zap className="h-5 w-5" />, label: 'Creative' },
                  { id: 'data-fusion', icon: <Database className="h-5 w-5" />, label: 'Fusions' },
                  { id: 'workspace-universe', icon: <Layers className="h-5 w-5" />, label: 'Universe' },
                  { id: 'library', icon: <Box className="h-5 w-5" />, label: 'Knowledge' },
                  { id: 'continuity', icon: <Activity className="h-5 w-5" />, label: 'Timeline' },
                  { id: 'media-hub', icon: <Maximize2 className="h-5 w-5" />, label: 'Media' },
                  { id: 'plugins', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(`/${item.id}`);
                      setIsConsoleOpen(false);
                    }}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-transparent px-4 py-6 text-center transition-colors hover:border-[var(--theme-text)]/10 hover:bg-[var(--theme-text)]/[0.04]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--theme-text)]/5 text-[var(--theme-text)]/70 transition-colors group-hover:bg-[var(--theme-primary)]/15 group-hover:text-[var(--theme-primary)]">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-[var(--theme-text)]/70 group-hover:text-[var(--theme-text)]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const IconButton: React.FC<{
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, label, active, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
      active
        ? 'bg-[var(--theme-primary)] text-white'
        : 'text-[var(--theme-text)]/55 hover:bg-[var(--theme-text)]/5 hover:text-[var(--theme-text)]'
    }`}
  >
    {children}
  </button>
);

const SummaryStat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-[var(--theme-text)]/40">{icon}</span>
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] font-medium text-[var(--theme-text)]/45">{label}</span>
      <span className="text-sm font-semibold text-[var(--theme-text)]">{value}</span>
    </div>
  </div>
);

export default CommandBridge;
