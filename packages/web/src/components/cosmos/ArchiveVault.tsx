import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Database, FileJson, Clock, Check, Download, Server, AlertTriangle } from 'lucide-react';
import { engine } from '@/lib/audio-engine';

export const ArchiveVault = () => {
  const { realm } = useRealm();
  const logs = useLiveQuery(() => db.cosmos_crisis_logs.reverse().toArray()) || [];
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedLog = logs.find(l => l.id === selectedLogId) || null;

  useEffect(() => {
    // Listen for crisis events and hydrate the DB
    const handleCrisis = async (e: Event) => {
      const customEvent = e as CustomEvent;
      
      const newLog = {
        agentId: 'RobinMemoryAgent',
        timestamp: new Date().toISOString(),
        savedPath: `/vault/crisis/${Date.now()}.md`,
        yamlFrontmatter: `---
type: mitigation_report
realm: ${realm.id}
agent: RobinMemoryAgent
timestamp: ${new Date().toISOString()}
token_health: ${Math.floor(Math.random() * 30 + 70)}%
---`,
        statusSnapshot: `### System Status Metrics

| Metric | Status |
|--------|--------|
| **Active Realm** | ${realm.name} |
| **Mitigation Status** | ACTIVE |
| **Core Loop** | Intercepted duplicate thought cycle. |
| **Action Required** | Operator review recommended. |`
      };

      try {
        await db.cosmos_crisis_logs.add(newLog);
      } catch (err) {
        console.error('Failed to log crisis', err);
      }
    };

    window.addEventListener('system:mitigation_active', handleCrisis);
    return () => window.removeEventListener('system:mitigation_active', handleCrisis);
  }, [realm]);

  const handleExport = () => {
    if (!selectedLog) return;
    setIsExporting(true);
    engine.playSound(realm.id);
    
    // Play theme specific export effect
    setTimeout(() => {
      const exportContent = `${selectedLog.yamlFrontmatter}\n\n${selectedLog.statusSnapshot}`;
      navigator.clipboard.writeText(exportContent);
      setCopied(true);
      setIsExporting(false);
      setTimeout(() => setCopied(false), 2000);
    }, 1000);
  };

  const getRowAnimation = () => {
    switch (realm.id) {
      case 'retro-tape':
        return {
          initial: { opacity: 0, x: -20, filter: 'hue-rotate(90deg) brightness(2)' },
          animate: { opacity: 1, x: 0, filter: 'hue-rotate(0deg) brightness(1)' },
          transition: { type: 'spring', stiffness: 200, damping: 10 }
        };
      case 'cyber-neon':
        return {
          initial: { opacity: 0, scale: 0.9, boxShadow: '0 0 20px #00f0ff' },
          animate: { opacity: 1, scale: 1, boxShadow: '0 0 0px #00f0ff' },
          transition: { duration: 0.3, ease: 'easeOut' }
        };
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 }
        };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[70vh] flex border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl shadow-2xl">
      {/* Left Sidebar: Log List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--theme-primary)]" />
          <h2 className="font-bold tracking-widest text-sm text-[var(--theme-text)]">THE ARCHIVE OF HISTORY</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const isSelected = selectedLogId === log.id;
              const animProps = getRowAnimation();
              return (
                <motion.div
                  key={log.id}
                  initial={animProps.initial}
                  animate={animProps.animate}
                  layout
                  onClick={() => {
                    setSelectedLogId(log.id!);
                    engine.playSound(realm.id);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border flex flex-col gap-1 relative overflow-hidden ${
                    isSelected 
                      ? 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)]/50' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-bold text-[var(--theme-primary)] truncate">{log.savedPath}</span>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/50 z-10">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  {isSelected && (
                    <motion.div 
                      layoutId="archiveSelection"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)]/10 to-transparent pointer-events-none"
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {logs.length === 0 && (
             <div className="flex-1 flex items-center justify-center text-white/20 text-xs uppercase tracking-widest p-4 text-center">
               No crisis logs archived
             </div>
          )}
        </div>
      </div>

      {/* Right Content: Obsidian Sync Console */}
      <div className="w-2/3 flex flex-col relative overflow-hidden">
        {selectedLog ? (
          <>
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-[var(--theme-primary)]" />
                <h3 className="font-bold tracking-widest text-sm text-[var(--theme-text)]">OBSIDIAN SYNC CONSOLE</h3>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2 bg-[var(--theme-primary)]/20 hover:bg-[var(--theme-primary)]/40 text-[var(--theme-primary)] border border-[var(--theme-primary)]/50 rounded flex items-center gap-2 text-xs font-bold tracking-widest transition-colors relative overflow-hidden group"
              >
                {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                {copied ? 'SYNCED' : 'COPY COMBINED CORE PAYLOAD'}
                {isExporting && (
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
                  />
                )}
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto z-10 font-mono text-sm">
              <div className="bg-black/50 p-4 rounded-lg border border-white/5 mb-4">
                <h4 className="text-[10px] uppercase text-white/50 mb-2 font-sans tracking-widest">YAML Frontmatter</h4>
                <pre className="text-emerald-400 whitespace-pre-wrap">{selectedLog.yamlFrontmatter}</pre>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <h4 className="text-[10px] uppercase text-white/50 mb-2 font-sans tracking-widest">Snapshot Payload</h4>
                <div className="text-[var(--theme-text-secondary)] prose prose-invert max-w-none whitespace-pre-wrap">
                  {selectedLog.statusSnapshot}
                </div>
              </div>
            </div>

            {/* Export Animation Overlay */}
            <AnimatePresence>
              {isExporting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[var(--theme-primary)]/10 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none"
                >
                  {realm.id === 'ironman-nano' ? (
                     <motion.div 
                       animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 0.5, repeat: Infinity }}
                       className="w-32 h-32 border-4 border-[var(--theme-primary)] rounded-full border-dashed shadow-[0_0_30px_var(--theme-primary)]"
                     />
                  ) : realm.id === 'venom-liquid' ? (
                     <motion.div 
                       animate={{ scale: [1, 2, 1], borderRadius: ['50%', '30%', '50%'] }}
                       transition={{ duration: 0.8, repeat: Infinity }}
                       className="w-32 h-32 bg-black mix-blend-multiply shadow-[0_0_30px_var(--theme-primary)]"
                     />
                  ) : (
                     <motion.div 
                       animate={{ height: ['0%', '100%'] }}
                       transition={{ duration: 0.5, repeat: Infinity }}
                       className="w-full bg-[var(--theme-primary)]/20 mix-blend-screen"
                     />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center gap-4">
            <Server className="w-16 h-16 opacity-50" />
            <p className="text-sm font-bold tracking-widest uppercase">Select a telemetry record from the ledger</p>
          </div>
        )}
      </div>
    </div>
  );
};
