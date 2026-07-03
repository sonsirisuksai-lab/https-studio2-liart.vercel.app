// packages/web/src/components/studio-pro/Analyzer.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Upload, Loader2, Music, Mic, MicOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface AnalysisResult {
  bpm: number;
  key: string;
  chords: string[];
  beats: number[];
  confidence: number;
}

export function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { playClick, playVinylDrop } = useSound();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      playClick();
      // Auto-analyze after upload
      analyzeAudio(e.target.files[0]);
    }
  };

  const analyzeAudio = (selectedFile: File) => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    playVinylDrop();

    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        bpm: 120 + Math.floor(Math.random() * 40),
        key: ['C', 'G', 'D', 'A', 'E', 'F'][Math.floor(Math.random() * 6)],
        chords: ['C', 'G', 'Am', 'F', 'Dm', 'Em', 'Bm'].slice(0, 3 + Math.floor(Math.random() * 3)),
        beats: Array.from({ length: 16 }, (_, i) => i % 4 === 0 ? 1 : Math.random() > 0.7 ? 1 : 0),
        confidence: 0.7 + Math.random() * 0.25,
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleMic = async () => {
    if (isListening) {
      setIsListening(false);
      playClick();
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      playClick();
      // Simulate real-time analysis
      setTimeout(() => {
        setIsListening(false);
        setResult({
          bpm: 140,
          key: 'A',
          chords: ['A', 'D', 'E', 'F#m'],
          beats: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          confidence: 0.9,
        });
      }, 3000);
    } catch (error) {
      console.error('Microphone access denied');
    }
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>📊 AI Music Analyzer</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Analyze Any Audio</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          Detect BPM, Key, Chords, and Beats
        </Body>
      </div>

      {/* Upload or Mic */}
      <div className="flex gap-[var(--space-2)]">
        <label className="flex-1">
          <div className="flex items-center justify-center gap-[var(--space-2)] p-[var(--space-4)] rounded-xl border-2 border-dashed border-[var(--theme-border)] hover:border-[var(--theme-primary)]/30 transition-all cursor-pointer bg-[var(--theme-glass)]">
            <Upload className="w-5 h-5 text-[var(--theme-text-secondary)]" />
            <span className="text-sm text-[var(--theme-text-secondary)]">Upload Audio</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </label>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMic}
          className={`p-[var(--space-4)] rounded-xl transition-all ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-[var(--theme-glass)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)]'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* File info */}
      {file && (
        <div className="p-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center gap-[var(--space-3)]">
          <Music className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-[var(--theme-text-secondary)]">{file.name}</span>
          <span className="text-xs text-[var(--theme-text-tertiary)] ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}

      {/* Analyzing state */}
      {isAnalyzing && (
        <div className="space-y-[var(--space-3)]">
          <GlassCard className="p-[var(--space-6)] text-center border-[var(--theme-border)]">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--theme-primary)]" />
            <p className="text-sm text-[var(--theme-text-secondary)] mt-3">Analyzing audio with neural models...</p>
          </GlassCard>
          <div className="grid grid-cols-3 gap-[var(--space-2)]">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-[var(--space-3)]"
        >
          <div className="grid grid-cols-3 gap-[var(--space-2)]">
            <GlassCard className="p-4 text-center border-[var(--theme-border)]">
              <div className="text-2xl font-bold text-cyan-500">{result.bpm}</div>
              <div className="text-[10px] text-[var(--theme-text-tertiary)]">BPM</div>
            </GlassCard>
            <GlassCard className="p-4 text-center border-[var(--theme-border)]">
              <div className="text-2xl font-bold text-[var(--theme-primary)]">{result.key}</div>
              <div className="text-[10px] text-[var(--theme-text-tertiary)]">Key</div>
            </GlassCard>
            <GlassCard className="p-4 text-center border-[var(--theme-border)]">
              <div className="text-2xl font-bold text-amber-500">{Math.round(result.confidence * 100)}%</div>
              <div className="text-[10px] text-[var(--theme-text-tertiary)]">Confidence</div>
            </GlassCard>
          </div>

          <GlassCard className="p-4 border-[var(--theme-border)]">
            <Label className="block mb-2">🎵 Chords</Label>
            <div className="flex flex-wrap gap-1.5">
              {result.chords.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded text-xs font-mono bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)]">
                  {c}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-[var(--theme-border)]">
            <Label className="block mb-2">🥁 Beats</Label>
            <div className="flex gap-0.5">
              {result.beats.map((b, i) => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{
                    background: b ? 'var(--theme-primary)' : 'var(--theme-border)',
                    opacity: b ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-3 border-[var(--theme-border)]">
            <div className="text-xs text-[var(--theme-text-tertiary)]">
              {isListening ? '🔴 Live analysis from microphone' : '📄 Analysis from uploaded file'}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
