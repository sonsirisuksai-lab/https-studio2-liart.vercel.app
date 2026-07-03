// packages/web/src/components/studio-pro/ChordGenerator.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Search, Loader2, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface ChordResult {
  title: string;
  artist: string;
  chords: string[];
  tabs: string[];
  lyrics?: string;
}

export function ChordGenerator() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChordResult | null>(null);
  const { playClick, playVinylDrop } = useSound();

  const generateChords = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    playClick();

    // Simulate AI generation
    setTimeout(() => {
      const mockResult: ChordResult = {
        title: query || 'Song Title',
        artist: 'AI Generated',
        chords: ['C', 'G', 'Am', 'F'],
        tabs: [
          'e|-----0-----0-----0-----0--',
          'B|-----1-----0-----1-----1--',
          'G|-----0-----0-----2-----2--',
          'D|-----2-----0-----2-----3--',
          'A|-----3-----2-----0-----3--',
          'E|-----3-----3-----0-----1--',
        ],
        lyrics: `[Verse 1]\n${query} is the song we sing,\nWith chords that make the heart take wing.\n\n[Chorus]\nC - G - Am - F,\nThis progression never fails.`,
      };
      setResult(mockResult);
      setIsLoading(false);
      playVinylDrop();
    }, 1500);
  };

  const exportData = () => {
    if (!result) return;
    playClick();
    const content = `# ${result.title}\n## Artist: ${result.artist}\n\n## Chords\n${result.chords.join(' - ')}\n\n## TAB\n${result.tabs.join('\n')}\n\n## Lyrics\n${result.lyrics}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title}-chords.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>🎵 AI Chord Generator</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Generate Chords & TAB</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          Enter a song title or description
        </Body>
      </div>

      <GlassCard className="p-[var(--space-4)] border-[var(--theme-border)]">
        <div className="flex gap-[var(--space-2)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Hotel California, or 'Pop song in C major'"
            className="flex-1 px-[var(--space-4)] py-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:border-[var(--theme-primary)]/30"
            onKeyDown={(e) => e.key === 'Enter' && generateChords()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateChords}
            disabled={isLoading || !query.trim()}
            className="px-[var(--space-4)] py-2 rounded-xl bg-gradient-to-r from-[var(--theme-primary)] to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-[var(--space-2)]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Generate
          </motion.button>
        </div>
      </GlassCard>

      {/* Loading state with Skeleton */}
      {isLoading && (
        <div className="space-y-[var(--space-3)]">
          <GlassCard className="p-[var(--space-6)] text-center border-[var(--theme-border)]">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--theme-primary)]" />
            <p className="text-sm text-[var(--theme-text-secondary)] mt-3">Synthesizing TAB notation...</p>
          </GlassCard>
          <div className="space-y-[var(--space-2)]">
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      )}

      {result && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-[var(--space-3)]"
        >
          <GlassCard className="p-[var(--space-4)] border-[var(--theme-border)]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold text-[var(--theme-text)]">{result.title}</div>
                <div className="text-sm text-[var(--theme-text-secondary)]">{result.artist}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="p-2 rounded-xl hover:bg-[var(--theme-glass)] transition-all text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="mt-3">
              <Label className="block mb-1">🎸 Chords</Label>
              <div className="flex flex-wrap gap-[var(--space-2)]">
                {result.chords.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)] font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <Label className="block mb-1">🎸 TAB</Label>
              <div className="space-y-0.5 font-mono text-xs text-[var(--theme-text-secondary)] bg-[var(--theme-surface)] border border-[var(--theme-border)] p-3 rounded-lg">
                {result.tabs.map((tab, i) => (
                  <div key={i}>{tab}</div>
                ))}
              </div>
            </div>

            {result.lyrics && (
              <div className="mt-3">
                <Label className="block mb-1">📝 Lyrics</Label>
                <div className="text-sm text-[var(--theme-text-secondary)] whitespace-pre-wrap bg-[var(--theme-surface)] border border-[var(--theme-border)] p-3 rounded-lg">
                  {result.lyrics}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
