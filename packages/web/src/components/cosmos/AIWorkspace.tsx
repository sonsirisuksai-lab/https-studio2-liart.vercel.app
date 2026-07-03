// packages/web/src/components/cosmos/AIWorkspace.tsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import {
  Music,
  BookOpen,
  IdCard,
  Dna,
  Printer as PrinterIcon,
  Type,
  Notebook as NotebookIcon,
  FolderOpen,
  Radio,
  Disc,
  Podcast,
  Cpu,
  Ruler,
} from 'lucide-react';

const AVAILABLE_OBJECTS = [
  { id: 'vinyl', icon: <Music className="w-5 h-5" />, label: 'Vinyl', color: '#FF6B35' },
  { id: 'cassette', icon: <Podcast className="w-5 h-5" />, label: 'Cassette', color: '#EC4899' },
  { id: 'book', icon: <BookOpen className="w-5 h-5" />, label: 'Book', color: '#E8A838' },
  { id: 'soulcard', icon: <IdCard className="w-5 h-5" />, label: 'Soul Card', color: '#AF52DE' },
  { id: 'dna', icon: <Dna className="w-5 h-5" />, label: 'DNA', color: '#34C759' },
  { id: 'printer', icon: <PrinterIcon className="w-5 h-5" />, label: 'Printer', color: '#FF9500' },
  { id: 'typewriter', icon: <Type className="w-5 h-5" />, label: 'Typewriter', color: '#5AC8FA' },
  { id: 'notebook', icon: <NotebookIcon className="w-5 h-5" />, label: 'Notebook', color: '#FFD60A' },
  { id: 'folder', icon: <FolderOpen className="w-5 h-5" />, label: 'Folder', color: '#8B5CF6' },
  { id: 'radio', icon: <Radio className="w-5 h-5" />, label: 'Radio', color: '#FF2D55' },
  { id: 'cd', icon: <Disc className="w-5 h-5" />, label: 'CD', color: '#06B6D4' },
  { id: 'blueprint', icon: <Ruler className="w-5 h-5" />, label: 'Blueprint', color: '#22C55E' },
  { id: 'code', icon: <Cpu className="w-5 h-5" />, label: 'Code', color: '#00D4FF' },
];

interface PlacedObject {
  id: string;
  x: number;
  y: number;
  type: string;
}

export function AIWorkspace() {
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objectCounter, setObjectCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playClick, playVinylDrop } = useSound();
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  // Helper values to place objects deterministically rather than with Math.random at render
  const deterministicPositions = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      x: 100 + (i * 73) % 300,
      y: 80 + (i * 47) % 200,
    }));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: width || 600, height: height || 450 });
        // Clamp existing objects
        setPlacedObjects((prev) =>
          prev.map((obj) => ({
            ...obj,
            x: Math.max(10, Math.min((width || 600) - 82, obj.x)),
            y: Math.max(10, Math.min((height || 450) - 82, obj.y)),
          }))
        );
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const addObject = (type: string) => {
    if (placedObjects.length >= 8) return;
    playClick();
    
    // Choose deterministic initial coordinate based on current list length
    const pos = deterministicPositions[placedObjects.length % deterministicPositions.length];
    const initialX = Math.min((pos.x / 500) * dimensions.width, dimensions.width - 82);
    const initialY = Math.min((pos.y / 350) * dimensions.height, dimensions.height - 82);
    
    const newObj: PlacedObject = {
      id: `${type}-${objectCounter}`,
      x: initialX,
      y: initialY,
      type,
    };
    setPlacedObjects([...placedObjects, newObj]);
    setObjectCounter(prev => prev + 1);
    playVinylDrop();
  };

  const removeObject = (id: string) => {
    setPlacedObjects(placedObjects.filter(obj => obj.id !== id));
    if (selectedObject === id) setSelectedObject(null);
    playClick();
  };

  const clearWorkspace = () => {
    setPlacedObjects([]);
    setSelectedObject(null);
    playClick();
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--space-2)]">
        <div>
          <span className="text-xs font-bold tracking-widest text-[var(--theme-primary)] uppercase">🖥️ Workspace Arena</span>
          <h2 className="text-2xl font-black text-[var(--theme-text)] tracking-tight mt-1">Cognitive Desktop</h2>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1">
            Drag physical objects onto the space, and watch the semantic matrix bridge them.
          </p>
        </div>
        <div className="flex gap-[var(--space-2)]">
          <button
            onClick={clearWorkspace}
            disabled={placedObjects.length === 0}
            className="px-[var(--space-4)] py-[var(--space-2)] rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50 text-xs font-bold uppercase tracking-wider"
          >
            Clear Space
          </button>
        </div>
      </div>

      {/* Object Palette */}
      <div className="p-[var(--space-3)] rounded-2xl bg-[var(--theme-glass)] backdrop-blur-xl border border-[var(--theme-border)] flex flex-wrap gap-[var(--space-2)]">
        {AVAILABLE_OBJECTS.map((obj) => (
          <button
            key={obj.id}
            onClick={() => addObject(obj.id)}
            className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{
              background: `${obj.color}15`,
              border: `1px solid ${obj.color}30`,
              color: obj.color,
            }}
          >
            {obj.icon}
            {obj.label}
          </button>
        ))}
      </div>

      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        className="relative min-h-[450px] rounded-2xl bg-[var(--theme-surface)]/40 border border-[var(--theme-border)] p-[var(--space-4)] overflow-hidden"
      >
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {placedObjects.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--theme-text-tertiary)] gap-[var(--space-2)]">
            <span className="text-4xl">🌌</span>
            <span className="text-sm font-medium tracking-wider uppercase">Workspace Arena Empty</span>
            <span className="text-xs">Click objects above to project them onto this desk</span>
          </div>
        )}

        {/* Semantic Link Canvas Lines */}
        {placedObjects.length >= 2 && (
          <svg className="absolute inset-0 pointer-events-none z-0">
            {placedObjects.map((obj, index) => {
              if (index === placedObjects.length - 1) return null;
              const next = placedObjects[index + 1];
              return (
                <g key={`link-${obj.id}-${next.id}`}>
                  <motion.line
                    x1={obj.x + 36}
                    y1={obj.y + 36}
                    x2={next.x + 36}
                    y2={next.y + 36}
                    stroke="var(--theme-primary)"
                    strokeWidth="2"
                    strokeDasharray="6, 6"
                    opacity="0.4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                  <circle
                    cx={(obj.x + next.x) / 2 + 36}
                    cy={(obj.y + next.y) / 2 + 36}
                    r="4"
                    fill="var(--theme-primary)"
                    className="animate-pulse"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Render Draggable Nodes */}
        <div className="relative z-10 w-full h-full">
          {placedObjects.map((obj) => {
            const info = AVAILABLE_OBJECTS.find((o) => o.id === obj.type);
            const isSelected = selectedObject === obj.id;
            return (
              <motion.div
                key={obj.id}
                drag
                dragMomentum={false}
                dragConstraints={containerRef}
                onDrag={(event, info) => {
                  setPlacedObjects((prev) =>
                    prev.map((p) =>
                      p.id === obj.id
                        ? { ...p, x: p.x + info.delta.x, y: p.y + info.delta.y }
                        : p
                    )
                  );
                }}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{ x: obj.x, y: obj.y }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileDrag={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedObject(obj.id);
                  playClick();
                }}
              >
                <div
                  className={cn(
                    'w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center p-2 relative select-none transition-all',
                    isSelected ? 'ring-2 ring-[var(--theme-primary)]' : ''
                  )}
                  style={{
                    background: isSelected ? `${info?.color}25` : 'var(--theme-surface)',
                    border: `1px solid ${info?.color || 'var(--theme-border)'}40`,
                    boxShadow: isSelected ? `0 0 20px ${info?.color}20` : 'var(--shadow-md)',
                  }}
                >
                  <div style={{ color: info?.color }} className="mb-1">
                    {info?.icon}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] truncate w-full text-center">
                    {info?.label}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeObject(obj.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] border border-red-500/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    style={{ opacity: isSelected ? 1 : undefined }}
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Semantic Connection Summary */}
      <AnimatePresence>
        {placedObjects.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-[var(--space-4)] rounded-2xl bg-[var(--theme-primary)]/5 border border-[var(--theme-primary)]/20"
          >
            <div className="flex items-center gap-[var(--space-3)] text-xs text-[var(--theme-text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-pulse" />
              <span className="font-bold tracking-widest uppercase">🧠 Semantic Bridge Configured:</span>
              <span className="text-[var(--theme-text)]">
                {placedObjects.map((o) => AVAILABLE_OBJECTS.find((a) => a.id === o.type)?.label).join(' ➔ ')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
