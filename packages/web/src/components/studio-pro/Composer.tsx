// packages/web/src/components/studio-pro/Composer.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Sparkles, Loader2, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface GeneratedSong {
  title: string;
  structure: {
    section: string;
    chords: string[];
    melody: string;
  }[];
  bpm: number;
  key: string;
  genre: string;
}

export function Composer() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<GeneratedSong | null>(null);
  const { playClick, playVinylDrop } = useSound();

  const genres = ['Pop', 'Rock', 'Jazz', 'Metal', 'Funk', 'EDM', 'Lo-fi', 'Classical'];

  const generateSong = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    playClick();

    setTimeout(() => {
      const mockSong: GeneratedSong = {
        title: `"${prompt.slice(0, 20)}"`,
        bpm: 120 + Math.floor(Math.random() * 40),
        key: ['C', 'G', 'D', 'A', 'E', 'F'][Math.floor(Math.random() * 6)],
        genre,
        structure: [
          { section: 'Intro (4 bars)', chords: ['C', 'G', 'Am', 'F'], melody: 'E4 G4 A4 B4' },
          { section: 'Verse (8 bars)', chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C'], melody: 'C4 E4 G4 A4 G4 E4 C4' },
          { section: 'Chorus (8 bars)', chords: ['F', 'G', 'Am', 'C', 'F', 'G', 'C', 'C'], melody: 'A4 C5 E5 D5 C5 A4 G4' },
          { section: 'Bridge (4 bars)', chords: ['Dm', 'G', 'C', 'Am'], melody: 'E4 F4 G4 A4' },
          { section: 'Chorus (8 bars)', chords: ['F', 'G', 'Am', 'C', 'F', 'G', 'C', 'C'], melody: 'A4 C5 E5 D5 C5 A4 G4' },
        ],
      };
      setSong(mockSong);
      setIsLoading(false);
      playVinylDrop();
    }, 2000);
  };

  const exportSong = () => {
    if (!song) return;
    playClick();
    const content = `# ${song.title}\n\n## Info\nGenre: ${song.genre}\nBPM: ${song.bpm}\nKey: ${song.key}\n\n## Structure\n\n${song.structure.map(s => 
      `### ${s.section}\nChords: ${s.chords.join(' - ')}\nMelody: ${s.melody}`
    ).join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title}-song.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>🎵 AI Composer</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Generate Full Songs</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          Describe what you want to compose
        </Body>
      </div>

      <GlassCard className="p-[var(--space-4)] border-[var(--theme-border)]">
        <div className="space-y-[var(--space-3)]">
          <div>
            <Label>Genre</Label>
            <div className="flex flex-wrap gap-[var(--space-2)] mt-1">
              {genres.map((g) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={g}
                  onClick={() => { setGenre(g); playClick(); }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    genre === g
                      ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30'
                      : 'bg-[var(--theme-glass)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)]'
                  }`}
                >
                  {g}
                </motion.button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your song idea... e.g. 'Sad acoustic ballad about lost love' or 'Upbeat electronic dance track with heavy bass'"
            className="w-full px-[var(--space-4)] py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:border-[var(--theme-primary)]/30 min-h-[80px] resize-none"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateSong}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-primary)] to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-[var(--space-2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Composing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Song
              </>
            )}
          </motion.button>
        </div>
      </GlassCard>

      {/* Loading state with Skeleton */}
      {isLoading && (
        <div className="space-y-[var(--space-3)]">
          <GlassCard className="p-[var(--space-6)] text-center border-[var(--theme-border)]">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--theme-primary)]" />
            <p className="text-sm text-[var(--theme-text-secondary)] mt-3">Arranging structures and chords...</p>
          </GlassCard>
          <div className="space-y-[var(--space-2)]">
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      )}

      {song && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-[var(--space-4)] border-[var(--theme-border)]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold text-[var(--theme-text)]">{song.title}</div>
                <div className="flex gap-[var(--space-2)] text-xs text-[var(--theme-text-secondary)] mt-1">
                  <span>{song.genre}</span>
                  <span>•</span>
                  <span>{song.bpm} BPM</span>
                  <span>•</span>
                  <span>Key: {song.key}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportSong}
                className="p-2 rounded-xl hover:bg-[var(--theme-glass)] transition-all text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="mt-3 space-y-[var(--space-2)]">
              {song.structure.map((section, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]">
                  <div className="text-xs font-medium text-[var(--theme-text-secondary)]">{section.section}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {section.chords.map((c, j) => (
                      <span key={j} className="text-xs font-mono text-[var(--theme-text)] px-2 py-0.5 rounded bg-[var(--theme-glass)] border border-[var(--theme-border)]">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--theme-text-tertiary)] mt-1 font-mono">
                    Melody: {section.melody}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
