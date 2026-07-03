// src/components/Forge/ForgeBoard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Glass3D } from '@/components/aether/Glass3D';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { Plus, Edit2, Trash2, Sparkles, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


type Column = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high';

const COLUMNS: { id: Column; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#30D158' },
  { id: 'in-progress', label: 'In Progress', color: '#FFD60A' },
  { id: 'review', label: 'Review', color: '#AF52DE' },
  { id: 'done', label: 'Done', color: '#5AC8FA' },
];

export function WorkBoard() {
  const [tasks, setTasks] = useState<Entity[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <RealmHeader 
          icon="Zap"
          title="WORK"
          subtitle="INDUSTRIAL · Task Matrix"
          glowColor={config.glowColor}
          className="mb-0"
        />
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-sm font-semibold shadow-lg shadow-emerald-500/5 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Forge Task
        </button>
      </div>

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
    </RealmContainer>
  );
}
