// packages/web/src/components/cosmos/DataFusion.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { findFusion, FUSION_RECIPES } from '@/lib/fusion-engine';
import { cn } from '@/lib/utils';
import { Sparkles, X, Plus } from 'lucide-react';

const FUSION_OBJECTS = [
  { id: 'vinyl', icon: '🎵', label: 'Vinyl', color: '#FF6B35' },
  { id: 'prompt', icon: '✨', label: 'Prompt', color: '#5AC8FA' },
  { id: 'soulcard', icon: '🃏', label: 'Soul Card', color: '#AF52DE' },
  { id: 'printer', icon: '🖨️', label: 'Printer', color: '#FF9500' },
  { id: 'dna', icon: '🧬', label: 'DNA', color: '#34C759' },
  { id: 'book', icon: '📖', label: 'Book', color: '#E8A838' },
  { id: 'blueprint', icon: '📐', label: 'Blueprint', color: '#22C55E' },
  { id: 'code', icon: '💻', label: 'Code', color: '#00D4FF' },
  { id: 'brain', icon: '🧠', label: 'Brain', color: '#AF52DE' },
  { id: 'notebook', icon: '📝', label: 'Notebook', color: '#FFD60A' },
];

export function DataFusion() {
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isFusing, setIsFusing] = useState(false);
  const { playClick, playVinylDrop, playFlip } = useSound();

  const handleSelect = (id: string) => {
    if (selectedObjects.includes(id)) {
      setSelectedObjects(selectedObjects.filter(s => s !== id));
      playClick();
      return;
    }
    if (selectedObjects.length >= 2) return;
    setSelectedObjects([...selectedObjects, id]);
    playClick();
  };

  const handleFuse = () => {
    if (selectedObjects.length < 2) return;
    setIsFusing(true);
    playFlip();

    const types = selectedObjects.map(id => FUSION_OBJECTS.find(o => o.id === id)?.id || '');
    const recipe = findFusion(types);

    setTimeout(() => {
      if (recipe) {
        setResult(recipe);
        playVinylDrop();
      } else {
        setResult({
          id: 'unknown',
          name: 'Unknown Fusion',
          icon: '❓',
          description: "These objects don't have a known fusion recipe yet. Try combining other elements!",
          result: {
            title: 'Unknown Combination',
            icon: '❓',
            description: 'Try combining different objects to discover new fusions.',
            action: 'Try Again',
          },
        });
        playClick();
      }
      setIsFusing(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedObjects([]);
    setResult(null);
    playClick();
  };

  const selectedObjectData = selectedObjects.map(id => FUSION_OBJECTS.find(o => o.id === id));

  return (
    <div className="space-y-[var(--space-4)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--space-2)]">
        <div>
          <span className="text-xs font-bold tracking-widest text-[var(--theme-primary)] uppercase">⚡ Nuclear Data Fusion</span>
          <h2 className="text-2xl font-black text-[var(--theme-text)] tracking-tight mt-1">Object Synthesis</h2>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1">
            Fuse two distinct cognitive objects to synthesize a completely new entity.
          </p>
        </div>
        <div className="text-xs font-mono text-[var(--theme-text-tertiary)]">
          {selectedObjects.length} / 2 Elements
        </div>
      </div>

      {/* Available Ingredients */}
      <div className="p-[var(--space-3)] rounded-2xl bg-[var(--theme-glass)] border border-[var(--theme-border)] flex flex-wrap gap-[var(--space-2)]">
        {FUSION_OBJECTS.map((obj) => {
          const isSelected = selectedObjects.includes(obj.id);
          return (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={obj.id}
              onClick={() => handleSelect(obj.id)}
              disabled={selectedObjects.length >= 2 && !isSelected}
              className={cn(
                'flex items-center gap-[var(--space-2)] px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-20',
                isSelected
                  ? 'border border-[var(--theme-primary)] text-white'
                  : 'bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:border-[var(--theme-text-tertiary)]'
              )}
              style={{
                borderColor: isSelected ? obj.color : undefined,
                backgroundColor: isSelected ? `${obj.color}15` : undefined,
                color: isSelected ? obj.color : undefined,
              }}
            >
              <span className="text-lg">{obj.icon}</span>
              {obj.label}
            </motion.button>
          );
        })}
      </div>

      {/* Synthesis Core Chamber */}
      <div
        className="relative p-[var(--space-6)] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center min-h-[160px] overflow-hidden transition-all duration-300"
        style={{
          borderColor: selectedObjects.length === 2 ? 'var(--theme-primary)' : 'var(--theme-border)',
          background: selectedObjects.length === 2 ? 'rgba(var(--theme-primary-rgb), 0.05)' : 'rgba(var(--glass-rgb), 0.1)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        </div>

        {selectedObjects.length === 0 && (
          <div className="text-center text-[var(--theme-text-tertiary)] flex flex-col items-center gap-1">
            <Plus className="w-8 h-8 opacity-20" />
            <span className="text-xs font-bold uppercase tracking-widest">Synthesis Chamber Ready</span>
            <span className="text-[10px]">Select any two variables from the options list above</span>
          </div>
        )}

        {selectedObjects.length === 1 && (
          <div className="flex items-center gap-[var(--space-4)]">
            <div className="flex flex-col items-center gap-1 scale-110">
              <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{selectedObjectData[0]?.icon}</span>
              <span className="text-[9px] font-bold text-[var(--theme-text-secondary)] uppercase tracking-widest">{selectedObjectData[0]?.label}</span>
            </div>
            <span className="text-2xl text-[var(--theme-text-tertiary)]">+</span>
            <span className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest animate-pulse">Select Second Variable</span>
          </div>
        )}

        {selectedObjects.length === 2 && (
          <div className="flex flex-col items-center gap-[var(--space-4)]">
            <div className="flex items-center gap-6">
              <motion.div animate={isFusing ? { x: [0, 40, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5 }} className="flex flex-col items-center gap-1">
                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{selectedObjectData[0]?.icon}</span>
                <span className="text-[9px] font-bold text-[var(--theme-text-secondary)] uppercase tracking-widest">{selectedObjectData[0]?.label}</span>
              </motion.div>
              <span className="text-2xl text-[var(--theme-primary)] font-black animate-pulse">✦</span>
              <motion.div animate={isFusing ? { x: [0, -40, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5 }} className="flex flex-col items-center gap-1">
                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{selectedObjectData[1]?.icon}</span>
                <span className="text-[9px] font-bold text-[var(--theme-text-secondary)] uppercase tracking-widest">{selectedObjectData[1]?.label}</span>
              </motion.div>
            </div>

            <div className="flex gap-[var(--space-2)]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFuse}
                disabled={isFusing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold uppercase text-xs tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isFusing ? 'Synthesizing...' : '⚡ Fuse Elements'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Synthesis Output Display */}
      <AnimatePresence>
        {result && !isFusing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="p-[var(--space-5)] rounded-2xl border bg-[var(--theme-surface)] relative overflow-hidden"
            style={{
              borderColor: result.id !== 'unknown' ? 'var(--theme-primary)' : 'var(--theme-border)',
            }}
          >
            {result.id !== 'unknown' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/10 rounded-full blur-3xl pointer-events-none" />
            )}
            <div className="flex items-start gap-[var(--space-4)]">
              <div className="text-5xl">{result.result?.icon || '❓'}</div>
              <div className="flex-1">
                <span className="text-[9px] font-bold tracking-widest text-[var(--theme-primary)] uppercase">Output Element</span>
                <h3 className="text-lg font-black text-[var(--theme-text)] mt-0.5">{result.result?.title || 'Synthesis Output'}</h3>
                <p className="text-xs text-[var(--theme-text-secondary)] mt-1 leading-relaxed">
                  {result.result?.description || 'Your custom synthesis output.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-all"
                >
                  {result.result?.action || 'Recycle Element'} →
                </motion.button>
              </div>
              <button
                onClick={handleReset}
                className="p-1 rounded-lg hover:bg-[var(--theme-glass)] border border-transparent hover:border-[var(--theme-border)] text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text)] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Library of Formulas */}
      <div className="p-[var(--space-4)] rounded-2xl bg-[var(--theme-glass)] border border-[var(--theme-border)]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)] block mb-3">🧪 Synthesizer Formula Library</span>
        <div className="flex flex-wrap gap-[var(--space-2)]">
          {FUSION_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              className="text-[10px] px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] flex items-center gap-[var(--space-2)] font-semibold"
            >
              {recipe.ingredients.map((ing, i) => (
                <span key={ing} className="flex items-center gap-1">
                  <span>{FUSION_OBJECTS.find(o => o.id === ing)?.icon || ing}</span>
                  {i < recipe.ingredients.length - 1 && <span className="text-[8px] opacity-40">+</span>}
                </span>
              ))}
              <span className="text-[var(--theme-text-tertiary)]">➔</span>
              <span className="text-[var(--theme-text)]">{recipe.icon} {recipe.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
