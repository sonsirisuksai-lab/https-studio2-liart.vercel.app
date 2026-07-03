import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealm } from '@/lib/RealmContext';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Database, FileJson, Clock, Check, Download, Server, AlertTriangle, 
  Layers, Settings, Link, FileCode, ArrowRight, Share2, Disc, Play, Copy
} from 'lucide-react';
import { engine } from '@/lib/audio-engine';

export const ArchiveVault = () => {
  const { realm } = useRealm();
  const logs = useLiveQuery(() => db.cosmos_crisis_logs.reverse().toArray()) || [];
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeHub, setActiveHub] = useState<'obsidian' | 'anytype' | 'notion'>('obsidian');
  const [syncStepText, setSyncStepText] = useState('INITIALIZING SECURE DATA TUNNEL...');

  // Notion Custom Properties Mappings State
  const [notionMappings, setNotionMappings] = useState({
    timestamp: { propName: 'Date Logged', propType: 'Date' },
    agentName: { propName: 'CDO Agent Identity', propType: 'Select' },
    tokenConsumption: { propName: 'Tokens Drilled', propType: 'Number' },
    severity: { propName: 'Crisis Index Level', propType: 'Select' }
  });

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

  // Dynamic Metadata Parser
  const parseLogMetadata = (log: any) => {
    if (!log) return { timestamp: '', agentName: '', tokenConsumption: 0, severity: 'MEDIUM' };
    
    // Extract token health/consumption
    const tokenHealthMatch = log.yamlFrontmatter?.match(/token_health:\s*(\d+)%/);
    const tokenConsumption = tokenHealthMatch
      ? parseInt(tokenHealthMatch[1]) * 15
      : Math.floor((log.statusSnapshot?.length || 100) * 1.8 + 350);

    // Extract severity level
    const isCritical = log.statusSnapshot?.toLowerCase().includes('critical') || log.yamlFrontmatter?.toLowerCase().includes('critical');
    const isWarning = log.statusSnapshot?.toLowerCase().includes('warning') || log.yamlFrontmatter?.toLowerCase().includes('warning');
    const isMitigation = log.statusSnapshot?.toLowerCase().includes('mitigation');
    
    const severity = isCritical ? 'CRITICAL' : isWarning ? 'HIGH' : isMitigation ? 'MEDIUM' : 'LOW';

    return {
      timestamp: log.timestamp || new Date().toISOString(),
      agentName: log.agentId || 'RobinMemoryAgent',
      tokenConsumption,
      severity
    };
  };

  // Notion Properties Generator
  const generateNotionPayload = (log: any, mappings: typeof notionMappings) => {
    const metadata = parseLogMetadata(log);
    const properties: Record<string, any> = {};

    // Timestamp Property mapping
    if (mappings.timestamp.propType === 'Date') {
      properties[mappings.timestamp.propName] = { date: { start: metadata.timestamp } };
    } else {
      properties[mappings.timestamp.propName] = { rich_text: [{ text: { content: metadata.timestamp } }] };
    }

    // Agent Name Property mapping
    if (mappings.agentName.propType === 'Select') {
      properties[mappings.agentName.propName] = { select: { name: metadata.agentName } };
    } else {
      properties[mappings.agentName.propName] = { rich_text: [{ text: { content: metadata.agentName } }] };
    }

    // Token Consumption Property mapping
    if (mappings.tokenConsumption.propType === 'Number') {
      properties[mappings.tokenConsumption.propName] = { number: metadata.tokenConsumption };
    } else {
      properties[mappings.tokenConsumption.propName] = { rich_text: [{ text: { content: String(metadata.tokenConsumption) } }] };
    }

    // Severity Property mapping
    if (mappings.severity.propType === 'Select') {
      properties[mappings.severity.propName] = { select: { name: metadata.severity } };
    } else {
      properties[mappings.severity.propName] = { rich_text: [{ text: { content: metadata.severity } }] };
    }

    return {
      parent: { database_id: "COSMOS_NOTION_INDEX" },
      properties
    };
  };

  // Anytype Object Relations Layout Payload Generator
  const generateAnytypeTemplate = (log: any) => {
    const metadata = parseLogMetadata(log);
    const jsonLdBlock = {
      "@context": "https://anytype.io/context/v1",
      "@type": "Object",
      "@id": `anytype://object/crisis-log-${log.id || 'current'}`,
      "name": log.savedPath || "Archive Entry",
      "relations": {
        "loggedAt": {
          "@type": "Relation",
          "name": "Date Logged",
          "value": metadata.timestamp
        },
        "agent": {
          "@type": "Relation",
          "name": "Operator Agent",
          "value": metadata.agentName
        },
        "energySpent": {
          "@type": "Relation",
          "name": "Token Cost",
          "value": metadata.tokenConsumption
        },
        "severity": {
          "@type": "Relation",
          "name": "Threat Level",
          "value": metadata.severity
        }
      },
      "meta": {
        "engine": "COSMOS SYSTEM GRAPH v5.2",
        "syncedFrom": "IndexedDB://Dexie/Archive"
      }
    };

    return `---
title: ${log.savedPath}
type: AnytypeObjectRelations
---

\`\`\`json-ld
${JSON.stringify(jsonLdBlock, null, 2)}
\`\`\`

# Anytype Core Object Relations Mapping

This snippet leverages Anytype's decentralized graph structures to interconnect crisis mitigations with local knowledge indexes.

## Object Details:
- **ID**: \`${jsonLdBlock["@id"]}\`
- **Relations Count**: 4 active objects
- **Type Signature**: \`MitigationReportObj\`

## Local Relations Schema:
- **Date Logged** ➔ \`${metadata.timestamp}\`
- **Operator Agent** ➔ \`${metadata.agentName}\`
- **Token Cost** ➔ \`${metadata.tokenConsumption} UI Tokens\`
- **Threat Level** ➔ \`[${metadata.severity}]\`

---

## Technical Log Body:
${log.statusSnapshot}`;
  };

  // Kinetic Export Handler
  const handleSyncTrigger = (payloadType: 'obsidian' | 'anytype' | 'notion') => {
    if (!selectedLog) return;
    setIsExporting(true);
    engine.playSound(realm.id);

    // Progressive loading text sequence
    const steps = [
      "ESTABLISHING SYSTEM SECURE TUNNEL...",
      "CALIBRATING CORE ENCRYPTORS...",
      "FORMATTING TRANSLATION MATRIX...",
      "COMMITTING ATOMIC DATA RECORD...",
      "SYNCHRONIZATION COMPLETED!"
    ];

    steps.forEach((text, i) => {
      setTimeout(() => {
        setSyncStepText(text);
      }, i * 350);
    });

    setTimeout(() => {
      let exportContent = '';
      if (payloadType === 'obsidian') {
        exportContent = `${selectedLog.yamlFrontmatter}\n\n${selectedLog.statusSnapshot}`;
      } else if (payloadType === 'anytype') {
        exportContent = generateAnytypeTemplate(selectedLog);
      } else if (payloadType === 'notion') {
        exportContent = JSON.stringify(generateNotionPayload(selectedLog, notionMappings), null, 2);
      }

      navigator.clipboard.writeText(exportContent);
      setCopied(true);
      setIsExporting(false);

      // Trigger custom success event for robot alerts
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cosmos-nfc-scan', {
          detail: { 
            tag: { 
              id: `TX-${selectedLog.id}-${realm.id.toUpperCase()}`,
              focusMode: `${payloadType.toUpperCase()} Vault Sync`
            } 
          }
        }));
      }

      setTimeout(() => setCopied(false), 2000);
    }, 1800);
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

  const currentMetadata = parseLogMetadata(selectedLog);

  return (
    <div className="w-full max-w-5xl mx-auto h-[75vh] flex border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl shadow-2xl">
      {/* Left Sidebar: Log List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--theme-primary)]" />
          <h2 className="font-bold tracking-widest text-sm text-[var(--theme-text)] uppercase">Ledger Archives</h2>
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
                    <span className="text-xs font-bold text-[var(--theme-primary)] truncate font-mono">{log.savedPath}</span>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/50 z-10 font-mono">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-black/40 text-cyan-400">
                      ID: #{log.id}
                    </span>
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

      {/* Right Content: Advanced Universal Knowledge Bridge */}
      <div className="w-2/3 flex flex-col relative overflow-hidden">
        {selectedLog ? (
          <>
            {/* Segmented Control widget: Target Vault Hub */}
            <div className="p-4 bg-black/40 border-b border-white/5 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-primary)] font-mono">
                Target Vault Hub
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-black/60 p-1 rounded-xl border border-white/5">
                {(['obsidian', 'anytype', 'notion'] as const).map((hub) => (
                  <button
                    key={hub}
                    onClick={() => {
                      setActiveHub(hub);
                      engine.playSound(realm.id);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border flex items-center justify-center gap-1.5 ${
                      activeHub === hub
                        ? 'bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] border-[var(--theme-primary)]/30 shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.15)]'
                        : 'bg-transparent border-transparent text-white/40 hover:text-white/80'
                    }`}
                  >
                    {hub === 'obsidian' && (
                      <>
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Obsidian</span>
                      </>
                    )}
                    {hub === 'anytype' && (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Anytype</span>
                      </>
                    )}
                    {hub === 'notion' && (
                      <>
                        <Settings className="w-3.5 h-3.5" />
                        <span>Notion Map</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Synchronizer Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeHub === 'obsidian' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-[var(--theme-primary)]" />
                      <div>
                        <h3 className="font-bold tracking-widest text-sm text-[var(--theme-text)] font-mono">OBSIDIAN MD CONSOLE</h3>
                        <p className="text-[10px] text-white/45">Standard YAML Frontmatter & Markdown Snapshot Block</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSyncTrigger('obsidian')}
                      disabled={isExporting}
                      className="px-4 py-2 bg-[var(--theme-primary)]/20 hover:bg-[var(--theme-primary)]/40 text-[var(--theme-primary)] border border-[var(--theme-primary)]/50 rounded-xl flex items-center gap-2 text-xs font-black tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                      {copied ? 'COPIED TO CLIPBOARD' : 'SYNC TO OBSIDIAN'}
                    </button>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-[9px] uppercase text-emerald-400 mb-2 font-mono tracking-widest">Obsidian YAML Frontmatter</h4>
                    <pre className="text-emerald-300 whitespace-pre-wrap font-mono text-xs">{selectedLog.yamlFrontmatter}</pre>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-[9px] uppercase text-emerald-400 mb-2 font-mono tracking-widest">Obsidian Markdown Body</h4>
                    <div className="text-white/80 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {selectedLog.statusSnapshot}
                    </div>
                  </div>
                </div>
              )}

              {activeHub === 'anytype' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[var(--theme-primary)] animate-pulse" />
                      <div>
                        <h3 className="font-bold tracking-widest text-sm text-[var(--theme-text)] font-mono">ANYTYPE OBJECT RELATIONS</h3>
                        <p className="text-[10px] text-white/45">Copy-paste templates optimized for decentralized graphs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSyncTrigger('anytype')}
                      disabled={isExporting}
                      className="px-4 py-2 bg-[var(--theme-primary)]/20 hover:bg-[var(--theme-primary)]/40 text-[var(--theme-primary)] border border-[var(--theme-primary)]/50 rounded-xl flex items-center gap-2 text-xs font-black tracking-widest transition-all hover:scale-[1.02]"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'COPIED FOR ANYTYPE' : 'COPY ANYTYPE PAYLOAD'}
                    </button>
                  </div>

                  <div className="bg-black/60 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>JSON-LD Relations Object Configured:</span>
                    </div>
                    <p className="text-[11px] text-white/65 leading-relaxed">
                      Anytype relies on local-first semantic graph links. This payload bundles standard JSON-LD schemas representing internal links (e.g., source Agent ➔ Select relation, Severity Index ➔ Relation index) so Anytype automatically constructs the node linkage upon pasting.
                    </p>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-[9px] uppercase text-cyan-400 mb-2 font-mono tracking-widest">Formatted Anytype Payload (Relations + JSON-LD)</h4>
                    <pre className="text-cyan-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {generateAnytypeTemplate(selectedLog)}
                    </pre>
                  </div>
                </div>
              )}

              {activeHub === 'notion' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[var(--theme-primary)]" />
                      <div>
                        <h3 className="font-bold tracking-widest text-sm text-[var(--theme-text)] font-mono">NOTION DATABASE PROPERTIES MAPPER</h3>
                        <p className="text-[10px] text-white/45">Configure and map telemetry vectors to Notion columns</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSyncTrigger('notion')}
                      disabled={isExporting}
                      className="px-4 py-2 bg-[var(--theme-primary)]/20 hover:bg-[var(--theme-primary)]/40 text-[var(--theme-primary)] border border-[var(--theme-primary)]/50 rounded-xl flex items-center gap-2 text-xs font-black tracking-widest transition-all hover:scale-[1.02]"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                      {copied ? 'PROPERTIES COPIED' : 'COPY NOTION PROPERTY PAYLOAD'}
                    </button>
                  </div>

                  {/* Visual Configuration Grid */}
                  <div className="bg-black/50 rounded-xl border border-white/5 overflow-hidden">
                    <div className="bg-black/40 px-4 py-2 border-b border-white/5 grid grid-cols-12 gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                      <div className="col-span-3">CRITICAL VECTOR</div>
                      <div className="col-span-4">NOTION PROPERTY COLUMN</div>
                      <div className="col-span-2">NOTION TYPE</div>
                      <div className="col-span-3 text-right">LIVE EXTRACTED VALUE</div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {/* Timestamp Row */}
                      <div className="p-4 grid grid-cols-12 gap-2 items-center text-xs font-mono">
                        <div className="col-span-3 text-white/80 font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Timestamp
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={notionMappings.timestamp.propName}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              timestamp: { ...notionMappings.timestamp, propName: e.target.value }
                            })}
                            className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={notionMappings.timestamp.propType}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              timestamp: { ...notionMappings.timestamp, propType: e.target.value as any }
                            })}
                            className="bg-black/60 border border-white/10 px-2 py-1.5 rounded-lg text-white font-mono text-xs w-full focus:outline-none"
                          >
                            <option value="Date">Date</option>
                            <option value="Rich Text">Rich Text</option>
                          </select>
                        </div>
                        <div className="col-span-3 text-right text-[10px] text-emerald-400 truncate" title={currentMetadata.timestamp}>
                          {new Date(currentMetadata.timestamp).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Agent Name Row */}
                      <div className="p-4 grid grid-cols-12 gap-2 items-center text-xs font-mono">
                        <div className="col-span-3 text-white/80 font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Agent Name
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={notionMappings.agentName.propName}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              agentName: { ...notionMappings.agentName, propName: e.target.value }
                            })}
                            className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={notionMappings.agentName.propType}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              agentName: { ...notionMappings.agentName, propType: e.target.value as any }
                            })}
                            className="bg-black/60 border border-white/10 px-2 py-1.5 rounded-lg text-white font-mono text-xs w-full focus:outline-none"
                          >
                            <option value="Select">Select</option>
                            <option value="Rich Text">Rich Text</option>
                          </select>
                        </div>
                        <div className="col-span-3 text-right text-[10px] text-emerald-400 truncate">
                          {currentMetadata.agentName}
                        </div>
                      </div>

                      {/* Token Consumption Row */}
                      <div className="p-4 grid grid-cols-12 gap-2 items-center text-xs font-mono">
                        <div className="col-span-3 text-white/80 font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Tokens Drilled
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={notionMappings.tokenConsumption.propName}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              tokenConsumption: { ...notionMappings.tokenConsumption, propName: e.target.value }
                            })}
                            className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={notionMappings.tokenConsumption.propType}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              tokenConsumption: { ...notionMappings.tokenConsumption, propType: e.target.value as any }
                            })}
                            className="bg-black/60 border border-white/10 px-2 py-1.5 rounded-lg text-white font-mono text-xs w-full focus:outline-none"
                          >
                            <option value="Number">Number</option>
                            <option value="Rich Text">Rich Text</option>
                          </select>
                        </div>
                        <div className="col-span-3 text-right text-[10px] text-emerald-400 font-bold">
                          {currentMetadata.tokenConsumption} UI
                        </div>
                      </div>

                      {/* Crisis Severity Row */}
                      <div className="p-4 grid grid-cols-12 gap-2 items-center text-xs font-mono">
                        <div className="col-span-3 text-white/80 font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Crisis Severity
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={notionMappings.severity.propName}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              severity: { ...notionMappings.severity, propName: e.target.value }
                            })}
                            className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={notionMappings.severity.propType}
                            onChange={(e) => setNotionMappings({
                              ...notionMappings,
                              severity: { ...notionMappings.severity, propType: e.target.value as any }
                            })}
                            className="bg-black/60 border border-white/10 px-2 py-1.5 rounded-lg text-white font-mono text-xs w-full focus:outline-none"
                          >
                            <option value="Select">Select</option>
                            <option value="Rich Text">Rich Text</option>
                          </select>
                        </div>
                        <div className="col-span-3 text-right text-[10px] text-emerald-400 font-bold uppercase">
                          {currentMetadata.severity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notion Generated Payload Preview */}
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[9px] uppercase text-cyan-400 font-mono tracking-widest">Notion API Properties JSON Structure</h4>
                      <span className="text-[8px] text-white/40 font-mono">LIVE AUTO-MAPPED OBJECT</span>
                    </div>
                    <pre className="text-cyan-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {JSON.stringify(generateNotionPayload(selectedLog, notionMappings), null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Themed Kinetic Synchronization Feedback Overlay */}
            <AnimatePresence>
              {isExporting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center select-none overflow-hidden"
                >
                  {/* Glowing background blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--theme-primary)]/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />

                  {/* Dynamic Theme Specific Visual animations */}
                  {realm.id === 'retro-tape' && (
                    <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                      {/* Interactive Cassette Tape SVG */}
                      <div className="relative w-72 h-44 bg-[#1a1510] border-4 border-[#e5c07b] rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_40px_rgba(229,192,123,0.25)] select-none">
                        {/* Cassette Header Label */}
                        <div className="bg-gradient-to-r from-red-500 via-[#e5c07b] to-green-500 h-6 rounded flex items-center justify-between px-3 text-[9px] font-black text-black font-mono">
                          <span>A: LEDGER WRITE</span>
                          <span>90 MIN</span>
                        </div>

                        {/* Cassette center view showing spinning reels */}
                        <div className="bg-black h-16 rounded-xl border-2 border-white/10 relative flex items-center justify-around overflow-hidden px-8">
                          {/* Left Tape Wheel */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ ease: "linear", duration: 1.5, repeat: Infinity }}
                            className="w-10 h-10 rounded-full border-4 border-dashed border-[#e5c07b] flex items-center justify-center bg-[#252015] relative shrink-0"
                          >
                            <div className="w-4 h-4 rounded-full bg-black border border-white/20" />
                          </motion.div>

                          {/* Center Magnetic Tape Layer */}
                          <div className="absolute w-20 h-12 bg-amber-900/40 blur-sm rounded pointer-events-none" />

                          {/* Right Tape Wheel */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ ease: "linear", duration: 1.5, repeat: Infinity }}
                            className="w-10 h-10 rounded-full border-4 border-dashed border-[#e5c07b] flex items-center justify-center bg-[#252015] relative shrink-0"
                          >
                            <div className="w-4 h-4 rounded-full bg-black border border-white/20" />
                          </motion.div>
                        </div>

                        {/* Cassette micro screw-heads */}
                        <div className="flex justify-between text-[#e5c07b]/40 text-[8px] font-bold font-mono px-1">
                          <span>⊕</span>
                          <span>⊕</span>
                        </div>
                      </div>

                      {/* Moving Digital VU Oscilloscope */}
                      <div className="flex gap-1 h-12 items-end justify-center w-full bg-black/40 border border-[#e5c07b]/20 p-2 rounded-xl">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ['15%', '90%', '15%'] }}
                            transition={{ duration: 0.3 + (i % 5) * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[#e5c07b] rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {realm.id === 'ironman-nano' && (
                    <div className="space-y-6 flex flex-col items-center">
                      {/* Advanced Holographic Reactor Core Shielding HUD */}
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Outer Rotating HUD Ring */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ ease: "linear", duration: 3, repeat: Infinity }}
                          className="absolute w-full h-full border-4 border-dashed border-orange-500 rounded-full opacity-60"
                        />
                        {/* Inner Counter-Rotating Ring */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ ease: "linear", duration: 2, repeat: Infinity }}
                          className="absolute w-5/6 h-5/6 border-2 border-dashed border-red-500 rounded-full opacity-50"
                        />
                        {/* Holographic Concentric Pulse Ring */}
                        <motion.div
                          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute w-2/3 h-2/3 border border-orange-400 rounded-full"
                        />
                        {/* Center Nanite Reactor core */}
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center shadow-[0_0_30px_#f97316]"
                        >
                          <Disc className="w-8 h-8 text-orange-400 animate-spin" style={{ animationDuration: '4s' }} />
                        </motion.div>
                      </div>

                      <div className="text-xs text-orange-400 font-bold tracking-widest font-mono uppercase bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 animate-pulse">
                        Holographic Stream Coupling Active
                      </div>
                    </div>
                  )}

                  {realm.id === 'cyber-neon' && (
                    <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                      {/* High Speed Cyber laser grid charging lines */}
                      <div className="relative w-full h-32 bg-[#05050b] border border-cyan-500/30 rounded-2xl p-4 overflow-hidden flex flex-col justify-between">
                        {/* Background glowing matrix lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(0,240,255,0.03)_2px,transparent_2px)] bg-[size:16px_16px]" />

                        {/* Moving vertical cyan lasers */}
                        <motion.div 
                          animate={{ y: ['-10%', '110%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] z-10"
                        />
                        <motion.div 
                          animate={{ y: ['110%', '-10%'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_10px_#ff007f] z-10"
                        />

                        {/* Glitch data blocks */}
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-cyan-400">
                          <span>⚡ NEON COUPLER: ACTIVE</span>
                          <span>TX_BUFF: OK</span>
                        </div>

                        {/* Rushing Binary bits preview */}
                        <div className="text-cyan-500/30 font-mono text-[9px] truncate tracking-widest h-8 flex items-center select-none pointer-events-none">
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <span key={idx} className="mr-2">01101001 10011101 11001010 01011100</span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-cyan-400 font-mono font-bold uppercase animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        Neon Power Core Shuttling Packets...
                      </div>
                    </div>
                  )}

                  {realm.id === 'venom-liquid' && (
                    <div className="space-y-6 flex flex-col items-center">
                      {/* Morphing Toxic bio-portal bubbles */}
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Morphing organic background shape */}
                        <motion.div
                          animate={{ 
                            borderRadius: ['40% 60% 70% 30% / 40% 50% 60% 70%', '60% 40% 30% 70% / 50% 60% 70% 40%', '40% 60% 70% 30% / 40% 50% 60% 70%'],
                            scale: [0.95, 1.15, 0.95]
                          }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute w-full h-full bg-gradient-to-br from-green-400/30 to-emerald-500/20 border-2 border-green-500 shadow-[0_0_35px_rgba(34,197,94,0.3)]"
                        />

                        {/* Floating Green toxic bubble drops */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              y: [-20 - (i % 3) * 10, -120 - (i % 2) * 20],
                              x: [((i * 13) % 30) - 15, ((i * 17) % 60) - 30],
                              scale: [0.5, 1.2, 0.3],
                              opacity: [0, 0.9, 0]
                            }}
                            transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeOut' }}
                            className="absolute w-4 h-4 bg-green-400 rounded-full"
                          />
                        ))}

                        <div className="z-10 bg-black/80 rounded-full p-4 border border-green-500/30">
                          <Layers className="w-10 h-10 text-green-400 animate-pulse" />
                        </div>
                      </div>

                      <div className="text-xs text-green-400 font-bold tracking-widest font-mono uppercase">
                        Injecting Acid Bio-Core Metadata
                      </div>
                    </div>
                  )}

                  {/* Sync status texts */}
                  <div className="space-y-2 mt-6 max-w-xs w-full">
                    <h3 className="text-sm font-black tracking-widest font-mono text-white animate-pulse">
                      {syncStepText}
                    </h3>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'easeInOut' }}
                        className="h-full bg-[var(--theme-primary)] shadow-[0_0_10px_var(--theme-primary)]"
                      />
                    </div>
                  </div>
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

