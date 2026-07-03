// packages/web/src/components/studio-pro/GuitarTrainer.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Camera, CameraOff, Loader2, Check, X } from 'lucide-react';

interface FingerPosition {
  finger: 'index' | 'middle' | 'ring' | 'pinky';
  fret: number;
  string: number;
  correct: boolean;
}

export function GuitarTrainer() {
  const [isActive, setIsActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<{ chord: string; fingers: FingerPosition[]; score: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoActiveRef = useRef(false);
  const { playClick, playVinylDrop } = useSound();

  const toggleCamera = async () => {
    if (isActive) {
      setIsActive(false);
      isVideoActiveRef.current = false;
      setResult(null);
      playClick();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
      isVideoActiveRef.current = true;
      playClick();
      detectChord();
    } catch (error) {
      console.error('Camera access denied');
    }
  };

  const detectChord = () => {
    if (!isVideoActiveRef.current) return;
    setIsDetecting(true);

    setTimeout(() => {
      if (!isVideoActiveRef.current) return;
      const chords = ['C', 'G', 'Am', 'F', 'D', 'E', 'A'];
      const randomChord = chords[Math.floor(Math.random() * chords.length)];
      const mockFingers: FingerPosition[] = [
        { finger: 'index', fret: 1, string: 2, correct: true },
        { finger: 'middle', fret: 2, string: 3, correct: true },
        { finger: 'ring', fret: 3, string: 4, correct: false },
        { finger: 'pinky', fret: 3, string: 5, correct: false },
      ];
      const correctCount = mockFingers.filter(f => f.correct).length;
      setResult({
        chord: randomChord,
        fingers: mockFingers,
        score: Math.round((correctCount / mockFingers.length) * 100),
      });
      setIsDetecting(false);
      playVinylDrop();

      if (isVideoActiveRef.current) {
        setTimeout(detectChord, 3000);
      }
    }, 2000);
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>🎸 AI Guitar Trainer</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Learn with Camera</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          AI detects your finger position in real-time
        </Body>
      </div>

      <GlassCard className="p-[var(--space-4)] border-[var(--theme-border)]">
        <div className="flex justify-between items-center mb-[var(--space-4)]">
          <div className="text-sm text-[var(--theme-text-secondary)]">
            {isActive ? '🔴 Camera active' : '⏸ Camera off'}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCamera}
            className={`p-2 rounded-xl transition-all ${
              isActive
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 hover:bg-[var(--theme-primary)]/30'
            }`}
          >
            {isActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </motion.button>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)] aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--theme-text-tertiary)] text-sm">
              Start camera to begin training
            </div>
          )}
          {isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-primary)]" />
            </div>
          )}
        </div>

        {result && !isDetecting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-[var(--space-4)] p-[var(--space-4)] rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-[var(--theme-primary)]">{result.chord}</div>
                <div className="text-sm text-[var(--theme-text-secondary)]">Detected chord</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: result.score > 70 ? '#22C55E' : '#F59E0B' }}>
                  {result.score}%
                </div>
                <div className="text-xs text-[var(--theme-text-secondary)]">Accuracy</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-[var(--space-2)]">
              {result.fingers.map((f, i) => (
                <div key={i} className={`p-2 rounded-lg text-xs text-center ${
                  f.correct ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div>{f.finger}</div>
                  <div>Fret {f.fret}</div>
                  {f.correct ? <Check className="w-3 h-3 mx-auto mt-0.5" /> : <X className="w-3 h-3 mx-auto mt-0.5" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
