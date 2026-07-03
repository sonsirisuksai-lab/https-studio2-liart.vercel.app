// src/components/Forge/ForgeBoard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Glass3D } from '@/components/aether/Glass3D';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { 
  Plus, Edit2, Trash2, Sparkles, CheckCircle, ShieldAlert, Award,
  Truck, Navigation, Package, Layers, Radio, Globe, RefreshCw, Box, AlertTriangle, Play, Check
} from 'lucide-react';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';
import { engine } from '@/lib/audio-engine';

type Column = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high';

const COLUMNS: { id: Column; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#30D158' },
  { id: 'in-progress', label: 'In Progress', color: '#FFD60A' },
  { id: 'review', label: 'Review', color: '#AF52DE' },
  { id: 'done', label: 'Done', color: '#5AC8FA' },
];

export function WorkBoard() {
  const [activeView, setActiveView] = useState<'matrix' | 'makro'>('matrix');
  const [tasks, setTasks] = useState<Entity[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Makro Delivery States
  const [deliveryRoutes, setDeliveryRoutes] = useState([
    { id: '1', origin: 'MAKRO Srinakarin', dest: 'Sukhumvit Depot', status: 'Transit', ETA: '8 min', driver: 'Nico Robin', latLngRatio: 0.35, payload: 'Refrigerated Wagyu beef & organic produce', type: 'Insulated Cold Box' },
    { id: '2', origin: 'MAKRO Lat Phrao', dest: 'Phra Khanong Hub', status: 'Pending', ETA: '24 min', driver: 'Roronoa Zoro', latLngRatio: 0, payload: 'Sake crates & wholesale rice stacks', type: 'XL Cargo Box' },
    { id: '3', origin: 'MAKRO Sathon', dest: 'Silom HQ', status: 'Completed', ETA: '0 min', driver: 'Tony Tony Chopper', latLngRatio: 1.0, payload: 'Medical grade ice chest packages', type: 'Insulated Cold Box' },
    { id: '4', origin: 'MAKRO Samsen', dest: 'Ari Bistro Zone', status: 'Transit', ETA: '15 min', driver: 'Vinsmoke Sanji', latLngRatio: 0.65, payload: 'Gourmet spices, fresh lobster cargo', type: 'M Carton Box' }
  ]);
  const [parcelSupplies, setParcelSupplies] = useState([
    { id: 'XS', name: 'XS Kraft Box', stock: 1240, max: 2000 },
    { id: 'S', name: 'S Standard Carton', stock: 850, max: 1500 },
    { id: 'M', name: 'M Heavy Duty Box', stock: 2100, max: 3000 },
    { id: 'L', name: 'L Cargo Crate', stock: 450, max: 1000 },
    { id: 'XL', name: 'XL Premium Wooden Crate', stock: 180, max: 500 },
    { id: 'COLD', name: 'Insulated Thermoshield Cold Box', stock: 620, max: 800 }
  ]);
  const [activeRouteId, setActiveRouteId] = useState<string>('1');
  const [trackingNumber, setTrackingNumber] = useState('MK-9082-TRK');
  const [isRefreshingLogistics, setIsRefreshingLogistics] = useState(false);

  // Zoro & Franky Coach State
  const [coach, setCoach] = useState<'zoro' | 'franky'>('zoro');
  const [feedback, setFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const loadTasks = React.useCallback(async () => {
    const data = await EntityEngine.list('work');
    setTasks(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await EntityEngine.create({
      type: 'task',
      title: newTitle,
      content: newContent || '',
      realm: 'work',
      tags: [],
      status: 'active',
      metadata: { column: 'todo', priority: newPriority },
    });
    setNewTitle('');
    setNewContent('');
    setNewPriority('medium');
    setShowAdd(false);
    loadTasks();
  };

  const moveTask = async (id: string, column: Column) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const currentMeta = task.metadata || {};
      const updatedMeta = { ...currentMeta, column };
      await EntityEngine.update(id, { metadata: updatedMeta });
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    await EntityEngine.delete(id);
    loadTasks();
  };

  const getTasksByColumn = React.useCallback((column: Column) =>
    tasks.filter(t => (t.metadata?.column || 'todo') === column), [tasks]);

  const getPriorityColor = (p?: Priority) => {
    switch (p) {
      case 'high': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
      case 'low': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
      default: return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' };
    }
  };

  // Crew advice function
  const askCoach = React.useCallback(async (chosenCoach: 'zoro' | 'franky') => {
    setLoadingFeedback(true);
    setCoach(chosenCoach);

    const todoCount = getTasksByColumn('todo').length;
    const progressCount = getTasksByColumn('in-progress').length;
    const reviewCount = getTasksByColumn('review').length;
    const doneCount = getTasksByColumn('done').length;

    const summary = `Tasks Status - To Do: ${todoCount}, In Progress: ${progressCount}, In Review: ${reviewCount}, Done: ${doneCount}.`;

    const systemRole = chosenCoach === 'zoro'
      ? `You are Roronoa Zoro ⚔️ from One Piece, the legendary three-sword style combatant of the Straw Hat crew.
You are extremely serious, highly dedicated, and hate lazy behavior. Speak in a tough, warrior-mentor voice.
Review the user's task status summary: ${summary}.
If they have a lot of To Do or In Progress tasks, scold them to train harder, stop procrastinating, and push forward! If they have high "Done" tasks, tell them it's a good start but the path to become the world's greatest is still long. Keep it extremely short (2-3 sentences max) and use emojis like ⚔️, 🟢, 🍶.`
      : `You are Franky 🛠️ from One Piece, the flamboyant, loud, cyborg shipwright of the Straw Hat crew.
You absolutely love building things, engineering great work, and shouting "SUPEEEER!". Speak in a highly enthusiastic, energetic, proud voice.
Review the user's task status summary: ${summary}.
Give them some loud, creative, constructive, and hyperactive advice. Praise them for building their dream projects! Keep it extremely short (2-3 sentences max) and use emojis like 🛠️, 🦾, ⚡, 🍔.`;

    try {
      const res = await geminiClient.generate(systemRole);
      setFeedback(res);
    } catch (err) {
      if (chosenCoach === 'zoro') {
        setFeedback(`Stop slacking off! ⚔️ Grab your swords and slice through those tasks like steel. Procrastination is a death sentence in battle!`);
      } else {
        setFeedback(`Ow! Today is looking SUPEEEER! 🦾 Let's construct these projects with pure cyborg power and hammer down those final tasks! ⚡`);
      }
    } finally {
      setLoadingFeedback(false);
    }
  }, [getTasksByColumn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tasks.length > 0) {
        askCoach(coach);
      } else {
        setFeedback(`Welcome to the Ship's Forge! ⚔️🛠️ Log some tasks and goals, and we'll help you slice through them or build them to perfection!`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [tasks.length, coach, askCoach]);

  // Analytics
  const totalTasks = tasks.length;
  const completedTasks = getTasksByColumn('done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      {/* View Switcher Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <RealmHeader 
            icon="Zap"
            title="WORK"
            subtitle={activeView === 'matrix' ? "INDUSTRIAL · Task Matrix" : "LOGISTICS · Makro Delivery"}
            glowColor={config.glowColor}
            className="mb-0"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented View Selector */}
          <div className="bg-black/40 border border-white/5 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => {
                setActiveView('matrix');
                engine.playSound(realm.id);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeView === 'matrix'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Task Matrix
            </button>
            <button
              onClick={() => {
                setActiveView('makro');
                engine.playSound(realm.id);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeView === 'makro'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Makro Delivery Operations
            </button>
          </div>

          {activeView === 'matrix' ? (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-xs font-bold shadow-lg shadow-emerald-500/5 hover:scale-105"
            >
              <Plus className="w-4.5 h-4.5" /> Forge Task
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRefreshingLogistics(true);
                engine.playSound(realm.id);
                setTimeout(() => setIsRefreshingLogistics(false), 1200);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-2 text-xs font-bold shadow-lg hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingLogistics ? 'animate-spin' : ''}`} /> Refresh Portal
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'matrix' ? (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Coach & Advisory Hub */}
            <Glass3D 
              glowColor="rgba(16, 185, 129, 0.15)"
              className="p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)] rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 relative z-20">
                    <button 
                      onClick={() => askCoach('zoro')}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all cursor-pointer ${
                        coach === 'zoro' 
                          ? 'bg-emerald-500/20 border-emerald-400 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                          : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                      }`}
                      title="Consult Swordsman Zoro ⚔️"
                    >
                      🟢
                    </button>
                    <button 
                      onClick={() => askCoach('franky')}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all cursor-pointer ${
                        coach === 'franky' 
                          ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                          : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                      }`}
                      title="Consult Shipwright Franky 🛠️"
                    >
                      🦾
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">
                    {coach === 'zoro' ? 'Zoro\'s Dojo' : 'Franky\'s Forge'}
                  </span>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 uppercase tracking-wider font-mono">
                        {coach === 'zoro' ? 'Zoro\'s Training Review' : 'Franky\'s Super Feedback'}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    </div>

                    {/* Progress Bar inside advisor card */}
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/40">
                      <span>Task progress:</span>
                      <span className="text-emerald-400 font-bold">{completionPercentage}%</span>
                    </div>
                  </div>

                  <div className="text-sm text-white/90 italic bg-black/30 p-4 rounded-2xl border border-white/5 relative">
                    {loadingFeedback ? (
                      <div className="flex items-center gap-2 text-white/50">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                        <span>Analyzing active blueprint vectors...</span>
                      </div>
                    ) : (
                      feedback || "Create some tasks to prompt crew reviews!"
                    )}
                  </div>
                </div>
              </div>
            </Glass3D>

            {/* Task Creation Modal/Panel */}
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">🔧 Design New Objective</span>
                    <button onClick={() => setShowAdd(false)} className="text-xs text-white/40 hover:text-white">Close</button>
                  </div>

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title (e.g. Master Three-Sword Style, Refit Thousand Sunny)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-white/30 focus:outline-none focus:border-emerald-500/30"
                  />
                  
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Objective parameters & detail descriptions..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-white/30 focus:outline-none focus:border-emerald-500/30 min-h-[80px] resize-none"
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                    <span className="text-xs text-white/50 font-mono">Priority Class:</span>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                        const colors = getPriorityColor(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewPriority(p)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border transition-all ${
                              newPriority === p 
                                ? `${colors.bg} ${colors.text} ${colors.border} scale-105 font-bold`
                                : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={addTask}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Forging Complete
                    </button>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {COLUMNS.map((col) => {
                const columnTasks = getTasksByColumn(col.id);
                return (
                  <div key={col.id} className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 flex items-center gap-2" style={{ color: col.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                        {col.label}
                      </span>
                      <span className="text-xs font-mono text-[var(--aether-text-tertiary)] bg-white/5 px-2 py-0.5 rounded-md font-bold">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-4 min-h-[300px] bg-white/[0.01] rounded-2xl p-2 border border-dashed border-white/5">
                      {columnTasks.map((task) => {
                        const colors = getPriorityColor(task.metadata?.priority);
                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/30 hover:scale-[1.01] transition-all cursor-grab group relative overflow-hidden"
                          >
                            {/* Top Action Header */}
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="text-sm font-bold text-[var(--aether-text-primary)] leading-snug group-hover:text-emerald-400 transition-colors">
                                {task.title}
                              </span>
                              
                              <div className="flex gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 rounded hover:bg-red-500/10 transition-all text-[var(--aether-text-tertiary)] hover:text-red-400"
                                  title="Deconstruct Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Content Description */}
                            {task.content && (
                              <Body size="15" className="text-white/60 text-xs line-clamp-3 mb-3 leading-relaxed">
                                {task.content}
                              </Body>
                            )}

                            {/* Bottom row: Priority & column navigation */}
                            <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3 mt-2">
                              {/* Priority label */}
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                                {task.metadata?.priority || 'medium'}
                              </span>

                              {/* Column Navigation triggers */}
                              <div className="flex gap-1">
                                {COLUMNS.filter(c => c.id !== col.id).map((c) => (
                                  <button
                                    key={c.id}
                                    onClick={() => moveTask(task.id, c.id)}
                                    className="text-[9px] font-semibold px-2 py-0.5 rounded border border-white/5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20 transition-all text-white/50"
                                    title={`Move to ${c.label}`}
                                  >
                                    {c.label.split(' ')[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}

                      {columnTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-white/20">
                          <span className="text-2xl mb-1">💤</span>
                          <span className="text-[10px] uppercase font-mono tracking-wider">Empty Bay</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="makro"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Embedded Portal Webview Frame */}
            <div className="rounded-3xl border border-white/10 bg-[#07090e] overflow-hidden shadow-2xl relative">
              
              {/* Fake Browser Chrome */}
              <div className="bg-[#0e121a] px-6 py-3 border-b border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-xl border border-white/5 text-white/50 text-xs font-mono">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-emerald-400 select-all font-semibold">https://</span>
                  <span className="text-white/60 truncate select-all">makro.logistics.cosmos.os/portal/delivery-operations</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-auto" title="Secure Tunnel Encrypted" />
                </div>

                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold font-mono uppercase bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded">WEB PORTAL ACTIVE</span>
                </div>
              </div>

              {isRefreshingLogistics ? (
                <div className="h-[600px] flex flex-col items-center justify-center bg-[#07090e]/80 text-center gap-4">
                  <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-wider font-mono text-white">RECALCULATING FREIGHT PARADIGMS</h3>
                    <p className="text-xs text-white/40 font-mono">Syncing telemetry data with MAKRO logistic nodes...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-[680px]">
                  
                  {/* Left panel: Active Routes & Shipments (3 cols) */}
                  <div className="lg:col-span-4 border-r border-white/5 p-6 space-y-4 flex flex-col bg-[#0b0f17]/40">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white/60 font-mono flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-emerald-400" /> ACTIVE FLEET ROUTES
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        {deliveryRoutes.filter(r => r.status === 'Transit').length} Transit
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[300px] lg:max-h-none">
                      {deliveryRoutes.map((route) => {
                        const isSelected = activeRouteId === route.id;
                        return (
                          <div
                            key={route.id}
                            onClick={() => {
                              setActiveRouteId(route.id);
                              engine.playSound(realm.id);
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {route.origin}
                                </h4>
                                <span className="text-[10px] font-mono text-white/40">➔ {route.dest}</span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                                route.status === 'Transit'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : route.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {route.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-2 border-t border-white/5">
                              <span>Pilot: {route.driver}</span>
                              <span className="text-emerald-400 font-bold">{route.ETA === '0 min' ? 'Arrived' : `ETA ${route.ETA}`}</span>
                            </div>

                            {/* Tiny real-time simulation loading line */}
                            {route.status === 'Transit' && (
                              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                                <motion.div
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${route.latLngRatio * 100}%` }}
                                  transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                                  className="h-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Dispatch controller inside Left Panel */}
                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          engine.playSound(realm.id);
                          setDeliveryRoutes(prev => prev.map(r => r.id === activeRouteId ? { ...r, status: 'Transit', ETA: '12 min', latLngRatio: 0.1 } : r));
                        }}
                        disabled={deliveryRoutes.find(r => r.id === activeRouteId)?.status !== 'Pending'}
                        className={`w-full py-3 rounded-2xl font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          deliveryRoutes.find(r => r.id === activeRouteId)?.status === 'Pending'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer hover:scale-[1.02] shadow-lg shadow-emerald-500/20'
                            : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Dispatch Active Cargo Run
                      </button>
                    </div>
                  </div>

                  {/* Center panel: Vector Map Tracing & Interactive Nodes (5 cols) */}
                  <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 font-mono">
                          REAL-TIME GEOSPATIAL VECTOR MAP
                        </h3>
                      </div>
                      <p className="text-xs text-white/40">Interactive matrix linking Makro warehouses to consumer hubs</p>
                    </div>

                    {/* Vector Map Graphic Canvas (SVG) */}
                    <div className="bg-black/40 border border-white/5 rounded-3xl p-4 flex-1 flex items-center justify-center relative min-h-[300px] overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
                      
                      <svg className="w-full h-full max-w-[380px] aspect-square" viewBox="0 0 400 400">
                        {/* Map Grid Elements */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Connection Lines */}
                        <path d="M 80 120 L 220 80 M 220 80 L 320 220 M 320 220 L 160 320 M 160 320 L 80 120 M 80 120 L 320 220 M 220 80 L 160 320" 
                              stroke="rgba(16, 185, 129, 0.1)" strokeWidth="3" />
                        
                        {/* Transit Path Dash Tracing */}
                        <path d="M 80 120 L 220 80 L 320 220" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="2" strokeDasharray="6,4" className="animate-[dash_20s_linear_infinite]" />
                        <path d="M 320 220 L 160 320 L 80 120" fill="none" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="2" strokeDasharray="6,4" className="animate-[dash_15s_linear_infinite]" />

                        {/* Interactive Pulser Warehouses / Hubs */}
                        {/* Node 1: Lat Phrao */}
                        <g className="cursor-pointer group/node" onClick={() => { setActiveRouteId('2'); engine.playSound(realm.id); }}>
                          <circle cx="80" cy="120" r="14" fill="rgba(16, 185, 129, 0.1)" className="hover:fill-emerald-500/25 transition-all" />
                          <circle cx="80" cy="120" r="6" fill="#10b981" />
                          <circle cx="80" cy="120" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                          <text x="80" y="145" textAnchor="middle" fill="white" className="text-[9px] font-mono font-bold uppercase select-none pointer-events-none opacity-60">LP-W1</text>
                        </g>

                        {/* Node 2: Srinakarin */}
                        <g className="cursor-pointer group/node" onClick={() => { setActiveRouteId('1'); engine.playSound(realm.id); }}>
                          <circle cx="220" cy="80" r="14" fill="rgba(16, 185, 129, 0.1)" className="hover:fill-emerald-500/25 transition-all" />
                          <circle cx="220" cy="80" r="6" fill="#10b981" />
                          <circle cx="220" cy="80" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '4s' }} />
                          <text x="220" y="60" textAnchor="middle" fill="white" className="text-[9px] font-mono font-bold uppercase select-none pointer-events-none opacity-60">SRI-DEPOT</text>
                        </g>

                        {/* Node 3: Sathon */}
                        <g className="cursor-pointer group/node" onClick={() => { setActiveRouteId('3'); engine.playSound(realm.id); }}>
                          <circle cx="320" cy="220" r="14" fill="rgba(16, 185, 129, 0.1)" className="hover:fill-emerald-500/25 transition-all" />
                          <circle cx="320" cy="220" r="6" fill="#10b981" />
                          <circle cx="320" cy="220" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                          <text x="320" y="245" textAnchor="middle" fill="white" className="text-[9px] font-mono font-bold uppercase select-none pointer-events-none opacity-60">SAT-HQ</text>
                        </g>

                        {/* Node 4: Samsen */}
                        <g className="cursor-pointer group/node" onClick={() => { setActiveRouteId('4'); engine.playSound(realm.id); }}>
                          <circle cx="160" cy="320" r="14" fill="rgba(16, 185, 129, 0.1)" className="hover:fill-emerald-500/25 transition-all" />
                          <circle cx="160" cy="320" r="6" fill="#10b981" />
                          <circle cx="160" cy="320" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '5.2s' }} />
                          <text x="160" y="345" textAnchor="middle" fill="white" className="text-[9px] font-mono font-bold uppercase select-none pointer-events-none opacity-60">SAM-HUB</text>
                        </g>

                        {/* Floating Animated Vehicles */}
                        {/* Transit Vehicle on Route 1 */}
                        <g className="animate-pulse">
                          <circle cx="129" cy="106" r="5" fill="#f59e0b" className="shadow-lg shadow-amber-500/50" />
                          <text x="129" y="96" textAnchor="middle" fill="#f59e0b" className="text-[8px] font-mono font-black select-none pointer-events-none">M1</text>
                        </g>

                        {/* Transit Vehicle on Route 4 */}
                        <g className="animate-pulse">
                          <circle cx="216" cy="285" r="5" fill="#f59e0b" />
                          <text x="216" y="275" textAnchor="middle" fill="#f59e0b" className="text-[8px] font-mono font-black select-none pointer-events-none">M4</text>
                        </g>
                      </svg>

                      {/* Floating metadata of selected route */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/50 font-mono">SELECTED TELEMETRY CHANNEL</span>
                          <span className="text-[9px] font-bold text-cyan-400 font-mono">CH-0{activeRouteId}</span>
                        </div>
                        {(() => {
                          const route = deliveryRoutes.find(r => r.id === activeRouteId);
                          if (!route) return null;
                          return (
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div>
                                <span className="text-white/40 text-[10px] block">PAYLOAD CONTENTS</span>
                                <span className="text-white font-bold truncate block">{route.payload}</span>
                              </div>
                              <div>
                                <span className="text-white/40 text-[10px] block">PARCEL CONTAINER</span>
                                <span className="text-cyan-300 font-bold block">{route.type}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Quick System Telemetry Warning (Budget / Resource check) */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase font-mono">Nami\'s Treasury Allocator</h4>
                        <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                          "Makro freight runs are running at peak efficiency, Boss! No thieves sighted, and every Baht is accounted for! 🍊💰"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Parcel Box Supplies Manager & Logs (4 cols) */}
                  <div className="lg:col-span-4 border-l border-white/5 p-6 space-y-6 bg-[#0b0f17]/20 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white/60 font-mono flex items-center gap-2">
                        <Package className="w-4 h-4 text-cyan-400" /> PARCEL SUPPLIES HUB
                      </h3>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {parcelSupplies.map((box) => {
                          const percentage = Math.round((box.stock / box.max) * 100);
                          const isCritical = percentage < 25;
                          return (
                            <div key={box.id} className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-2 relative group hover:border-white/10 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white font-mono">{box.name}</span>
                                <span className="text-[10px] font-mono text-white/40 font-bold">{box.stock} / {box.max} U</span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                                  {percentage}%
                                </span>
                              </div>

                              {/* Restock action trigger */}
                              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all pt-1">
                                <button
                                  onClick={() => {
                                    engine.playSound(realm.id);
                                    setParcelSupplies(prev => prev.map(b => b.id === box.id ? { ...b, stock: Math.min(b.max, b.stock + 50) } : b));
                                  }}
                                  className="text-[9px] font-black uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/20"
                                >
                                  +50 Restock Supply
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tracking simulation entry tool */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.12em] text-white/50 font-mono">SIMULATED TRACKING SEARCH</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="MK-XXXX-TRK"
                          className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/5 text-xs text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-cyan-500/30"
                        />
                        <button
                          onClick={() => {
                            engine.playSound(realm.id);
                            setIsRefreshingLogistics(true);
                            setTimeout(() => {
                              setIsRefreshingLogistics(false);
                            }, 800);
                          }}
                          className="px-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all text-xs font-bold font-mono"
                        >
                          TRACE
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </RealmContainer>
  );
}

