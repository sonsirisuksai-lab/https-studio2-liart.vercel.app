// packages/web/src/components/studio-pro/MIDIExport.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Download, Loader2, Music } from 'lucide-react';

interface MIDIExportProps {
  onExport?: (data: any) => void;
}

export function MIDIExport({ onExport }: MIDIExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [pattern, setPattern] = useState<string>('rock');
  const [bpm, setBpm] = useState(120);
  const { playClick, playVinylDrop } = useSound();

  const patterns = [
    { id: 'rock', label: 'Rock', bpm: 120 },
    { id: 'funk', label: 'Funk', bpm: 100 },
    { id: 'jazz', label: 'Jazz', bpm: 140 },
    { id: 'electronic', label: 'Electronic', bpm: 130 },
  ];

  const handleExport = () => {
    setIsExporting(true);
    playClick();

    // Simulate MIDI generation
    setTimeout(() => {
      // Create mock MIDI data
      const midiData = {
        format: 1,
        tracks: 1,
        division: 480,
        bpm,
        notes: [
          { pitch: 36, time: 0, duration: 0.25, velocity: 80 },
          { pitch: 38, time: 0.5, duration: 0.25, velocity: 70 },
          { pitch: 42, time: 0.25, duration: 0.125, velocity: 60 },
        ],
      };

      // Create blob
      const json = JSON.stringify(midiData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Download
      const a = document.createElement('a');
      a.href = url;
      a.download = `pattern-${pattern}-${Date.now()}.mid`;
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      playVinylDrop();
      onExport?.(midiData);
    }, 1500);
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>🎵 AI MIDI Export</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Export Your Pattern</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          Generate MIDI files from your patterns
        </Body>
      </div>

      <GlassCard className="p-[var(--space-5)] border-[var(--theme-border)]">
        <div className="space-y-[var(--space-4)]">
          {/* Pattern Selector */}
          <div>
            <Label>Pattern</Label>
            <div className="flex flex-wrap gap-[var(--space-2)] mt-1">
              {patterns.map((p) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={p.id}
                  onClick={() => {
                    setPattern(p.id);
                    setBpm(p.bpm);
                    playClick();
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    pattern === p.id
                      ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30'
                      : 'bg-[var(--theme-glass)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)]'
                  }`}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* BPM */}
          <div>
            <Label>BPM</Label>
            <div className="flex items-center gap-[var(--space-4)] mt-1">
              <input
                type="range"
                min="40"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="flex-1 accent-[var(--theme-primary)] h-1"
              />
              <span className="text-lg font-mono text-amber-500 w-12 text-center">{bpm}</span>
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-primary)] to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-[var(--space-2)]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export MIDI (.mid)
              </>
            )}
          </motion.button>

          {/* Preview */}
          <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]">
            <div className="flex items-center gap-[var(--space-2)] text-xs text-[var(--theme-text-secondary)]">
              <Music className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>Pattern: {patterns.find(p => p.id === pattern)?.label}</span>
              <span>·</span>
              <span>{bpm} BPM</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
