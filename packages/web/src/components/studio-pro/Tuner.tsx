// packages/web/src/components/studio-pro/Tuner.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/cards/GlassCard';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { useSound } from '@/hooks/useSound';
import { Mic, MicOff, Check } from 'lucide-react';

interface Note {
  name: string;
  frequency: number;
}

const NOTES: Note[] = [
  { name: 'E', frequency: 82.41 },
  { name: 'A', frequency: 110.0 },
  { name: 'D', frequency: 146.83 },
  { name: 'G', frequency: 196.0 },
  { name: 'B', frequency: 246.94 },
  { name: 'E', frequency: 329.63 },
];

const STRINGS = {
  guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  bass: ['E1', 'A1', 'D2', 'G2'],
  ukulele: ['G4', 'C4', 'E4', 'A4'],
};

export function Tuner() {
  const [instrument, setInstrument] = useState<'guitar' | 'bass' | 'ukulele'>('guitar');
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [currentFreq, setCurrentFreq] = useState(0);
  const [detectedString, setDetectedString] = useState<string | null>(null);
  const [isInTune, setIsInTune] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const isListeningRef = useRef(false);
  const { playClick } = useSound();

  const strings = STRINGS[instrument];
  const stringFreqs = strings.map(s => {
    const note = NOTES.find(n => n.name === s[0]);
    return note ? note.frequency : 0;
  });

  const toggleListening = async () => {
    if (isListening) {
      if (sourceRef.current) sourceRef.current.disconnect();
      if (ctxRef.current) ctxRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsListening(false);
      isListeningRef.current = false;
      setCurrentNote(null);
      setDetectedString(null);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;
      setIsListening(true);
      isListeningRef.current = true;
      detectPitch();
      playClick();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  const detectPitch = () => {
    if (!analyserRef.current || !ctxRef.current) return;

    const analyser = analyserRef.current;
    const data = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(data);

    // Autocorrelation
    const sampleRate = ctxRef.current.sampleRate;
    let maxCorr = 0;
    let maxLag = 0;

    for (let lag = 20; lag < 1000; lag++) {
      let corr = 0;
      for (let i = 0; i < data.length - lag; i++) {
        corr += data[i] * data[i + lag];
      }
      if (corr > maxCorr) {
        maxCorr = corr;
        maxLag = lag;
      }
    }

    if (maxLag > 0) {
      const freq = sampleRate / maxLag;
      setCurrentFreq(freq);

      // Find closest note
      let closest = 'C';
      let minDiff = Infinity;
      for (const note of NOTES) {
        const diff = Math.abs(freq - note.frequency);
        if (diff < minDiff) {
          minDiff = diff;
          closest = note.name;
        }
      }
      setCurrentNote(closest);

      // Check if matches string
      const tolerance = 3;
      let found = false;
      for (let i = 0; i < stringFreqs.length; i++) {
        if (stringFreqs[i] > 0 && Math.abs(freq - stringFreqs[i]) < tolerance) {
          setDetectedString(strings[i]);
          setIsInTune(Math.abs(freq - stringFreqs[i]) < 1);
          found = true;
          break;
        }
      }
      if (!found) {
        setDetectedString(null);
        setIsInTune(false);
      }
    }

    if (isListeningRef.current) {
      animationRef.current = requestAnimationFrame(detectPitch);
    }
  };

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (sourceRef.current) sourceRef.current.disconnect();
      if (ctxRef.current) ctxRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const getStringColor = (index: number) => {
    const string = strings[index];
    if (detectedString === string) {
      return isInTune ? 'text-green-400' : 'text-amber-400';
    }
    return 'text-white/20';
  };

  return (
    <div className="space-y-[var(--space-4)]">
      <div>
        <Label>🎸 Smart Guitar Tuner</Label>
        <Heading size="48" weight="300" className="text-base text-[var(--theme-text)]">Tune Your Instrument</Heading>
        <Body size="16" className="text-[var(--theme-text-secondary)] mt-1">
          Real-time pitch detection with visual feedback
        </Body>
      </div>

      {/* Instrument Selector */}
      <div className="flex gap-[var(--space-2)]">
        {(['guitar', 'bass', 'ukulele'] as const).map((inst) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={inst}
            onClick={() => setInstrument(inst)}
            className={`px-[var(--space-4)] py-[var(--space-2)] rounded-xl text-sm font-medium transition-all ${
              instrument === inst
                ? 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30'
                : 'bg-[var(--theme-glass)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)]'
            }`}
          >
            {inst.charAt(0).toUpperCase() + inst.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Main Tuner */}
      <GlassCard className="p-[var(--space-5)] border-[var(--theme-border)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm font-medium text-[var(--theme-text-secondary)]">
              {isListening ? '🎤 Listening...' : '🔇 Click Start to tune'}
            </div>
            {currentFreq > 0 && (
              <div className="text-2xl font-bold text-amber-500 font-mono">
                {currentFreq.toFixed(1)} Hz
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 hover:bg-[var(--theme-primary)]/30'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Note Display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold font-mono" style={{ color: isInTune ? '#22C55E' : '#F59E0B' }}>
            {currentNote || '--'}
          </div>
          <div className="text-sm text-[var(--theme-text-tertiary)] mt-1">
            {detectedString ? `${detectedString} detected` : 'Play a string'}
          </div>
        </div>

        {/* Tuner visualizer */}
        <div className="w-full h-1.5 bg-[var(--theme-border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all"
            animate={{
              width: isListening ? '50%' : '0%',
              x: isListening ? '0%' : '-50%',
            }}
            style={{
              background: isInTune ? 'linear-gradient(90deg, #22C55E, #4ADE80)' : 'linear-gradient(90deg, #F59E0B, #EF4444)',
            }}
          />
        </div>

        {/* Strings */}
        <div className="grid grid-cols-2 gap-[var(--space-2)] mt-[var(--space-4)]">
          {strings.map((s, i) => {
            const isDetected = detectedString === s;
            return (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                  isDetected ? (isInTune ? 'bg-green-500/20 border border-green-500/30' : 'bg-amber-500/20 border border-amber-500/30') : 'bg-[var(--theme-surface)] border border-[var(--theme-border)]'
                }`}
              >
                <span className={`text-sm font-mono ${getStringColor(i)}`}>{s}</span>
                <span className="text-xs text-[var(--theme-text-tertiary)] flex items-center">
                  {stringFreqs[i].toFixed(1)} Hz
                  {isDetected && (isInTune ? <Check className="w-3.5 h-3.5 inline ml-1 text-green-400" /> : ' ⚡')}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
