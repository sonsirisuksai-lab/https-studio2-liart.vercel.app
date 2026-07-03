import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, Volume2, Mic, MicOff, Activity, Music, Sliders, Sparkles, Zap, Moon, Sun, Settings, List, SkipForward, SkipBack, Camera, CameraOff, Loader2, Download, Clock, Wind, Save, Upload, FileDown, Keyboard, LineChart, Hand, Shuffle, FolderOpen, Heart } from 'lucide-react';
import { Midi } from '@tonejs/midi';

// Aether Components
import { AetherCard } from '../components/aether/Card';
import { Heading, Body, Label } from '../components/aether/Typography';
import { Lighting } from '../components/aether/Lighting';
import { Grid, GridItem } from '../components/aether/Grid';
import { Player } from '../components/aether/Player';
import { Glass } from '../components/aether/Glass';
import { Waveform } from '../components/aether/Waveform';
import { colorEngine } from '../lib/color';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


// ─── TYPES ────────────────────────────────────────────────────────────────
interface DrumGrid {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  bass: boolean[];
}

interface LogEntry {
  id: number;
  type: 'system' | 'audio' | 'note' | 'pitch' | 'error' | 'midi' | 'storage';
  source: string;
  message: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}

interface PatternPreset {
  name: string;
  grid: DrumGrid;
  bpm: number;
}

const PRESETS: PatternPreset[] = [
  {
    name: 'Rock',
    grid: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0].map(Boolean),
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(Boolean),
      bass: [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0].map(Boolean),
    },
    bpm: 120,
  },
  {
    name: 'Funk',
    grid: {
      kick: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0].map(Boolean),
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1].map(Boolean),
      hihat: [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1].map(Boolean),
      bass: [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0].map(Boolean),
    },
    bpm: 100,
  },
  {
    name: 'Electronic',
    grid: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0].map(Boolean),
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
      hihat: [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0].map(Boolean),
      bass: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0].map(Boolean),
    },
    bpm: 130,
  }
];

export function Studio() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [grid, setGrid] = useState<DrumGrid>({
    kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0].map(Boolean),
    bass: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0].map(Boolean),
  });
  
  const [activeTab, setActiveTab] = useState<'sequencer' | 'pitch' | 'agents' | 'settings'>('sequencer');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [detectedNote, setDetectedNote] = useState<{ note: string; cents: number } | null>(null);
  const [transientStrength, setTransientStrength] = useState(0);
  
  const [synthCutoff, setSynthCutoff] = useState(1200);
  const [synthDetune, setSynthDetune] = useState(0);
  const [synthRelease, setSynthRelease] = useState(0.3);
  const [synthDelayMix, setSynthDelayMix] = useState(0.35);
  const [volumes, setVolumes] = useState({ kick: 80, snare: 70, hihat: 60, bass: 75 });
  
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [isTapping, setIsTapping] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<'kick' | 'snare' | 'hihat' | 'bass'>('kick');
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [dynamicColor, setDynamicColor] = useState('#8B5CF6');
  const [waveformBuffer, setWaveformBuffer] = useState<Float32Array | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const delayWetRef = useRef<GainNode | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const oscAnimationRef = useRef<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const addLog = useCallback((
    type: LogEntry['type'],
    source: string,
    message: string,
    status?: LogEntry['status']
  ) => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      type,
      source,
      message,
      status,
      timestamp: Date.now(),
    }].slice(-50));
  }, []);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const analyzer = ctx.createAnalyser();
    analyzer.fftSize = 512;
    analyzerRef.current = analyzer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = synthCutoff;
    filterNodeRef.current = filter;

    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = 0.375;
    delayNodeRef.current = delay;

    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.4;
    delayFeedbackRef.current = delayFeedback;

    const delayWet = ctx.createGain();
    delayWet.gain.value = synthDelayMix;
    delayWetRef.current = delayWet;

    // Media Recorder Destination
    const dest = ctx.createMediaStreamDestination();
    mediaDestRef.current = dest;

    filter.connect(analyzer);
    analyzer.connect(ctx.destination);
    analyzer.connect(dest);

    filter.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(ctx.destination);
    delayWet.connect(dest);

    addLog('system', 'SYSTEM', 'Web Audio API initialized', 'success');
  }, [synthCutoff, synthDelayMix, addLog]);

  const getVolume = useCallback((type: keyof typeof volumes) => {
    return volumes[type] / 100;
  }, [volumes]);

  const triggerKick = useCallback((time: number, ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
    const vol = getVolume('kick');
    gain.gain.setValueAtTime(0.8 * vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain);
    if (filterNodeRef.current) gain.connect(filterNodeRef.current);
    else gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
    setTransientStrength(80);
    setTimeout(() => setTransientStrength(s => Math.max(0, s - 20)), 50);
  }, [getVolume]);

  const triggerSnare = useCallback((time: number, ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + 0.05);
    const vol = getVolume('snare');
    gain.gain.setValueAtTime(0.5 * vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    if (filterNodeRef.current) gain.connect(filterNodeRef.current);
    else gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  }, [getVolume]);

  const triggerHihat = useCallback((time: number, ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    const vol = getVolume('hihat');
    gain.gain.setValueAtTime(0.3 * vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.connect(gain);
    if (analyzerRef.current) gain.connect(analyzerRef.current);
    else gain.connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.04);
  }, [getVolume]);

  const triggerBassSynth = useCallback((time: number, freq: number, ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const oscSub = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.setValueAtTime(synthDetune, time);
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(freq / 2, time);
    const vol = getVolume('bass');
    
    osc.connect(oscGain);
    oscSub.connect(oscGain);
    
    if (filterNodeRef.current) oscGain.connect(filterNodeRef.current);
    else oscGain.connect(ctx.destination);

    oscGain.gain.setValueAtTime(0.35 * vol, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01 * vol, time + synthRelease);
    osc.start(time);
    oscSub.start(time);
    osc.stop(time + synthRelease + 0.1);
    oscSub.stop(time + synthRelease + 0.1);
    setTransientStrength(100);
    setTimeout(() => setTransientStrength(s => Math.max(0, s - 30)), 50);
  }, [synthDetune, synthRelease, getVolume]);

  const triggerMetronome = useCallback((time: number, ctx: AudioContext) => {
    if (!metronomeOn) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  }, [metronomeOn]);

  const scheduleNote = useCallback((step: number, time: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    triggerMetronome(time, ctx);
    if (grid.kick[step]) triggerKick(time, ctx);
    if (grid.snare[step]) triggerSnare(time, ctx);
    if (grid.hihat[step]) triggerHihat(time, ctx);
    if (grid.bass[step]) {
      const bassNotes = [55, 65.41, 73.42, 82.41, 98.0, 110, 130.81, 146.83];
      const pitchIndex = (step * 3) % bassNotes.length;
      triggerBassSynth(time, bassNotes[pitchIndex], ctx);
    }
    const msToStep = Math.max(0, (time - ctx.currentTime) * 1000);
    setTimeout(() => setActiveStep(step), msToStep);
  }, [grid, triggerKick, triggerSnare, triggerHihat, triggerBassSynth, triggerMetronome]);

  const advanceStep = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    const stepDuration = secondsPerBeat / 4;
    nextNoteTimeRef.current += stepDuration;
    currentStepRef.current = (currentStepRef.current + 1) % 16;
  }, [bpm]);

  const schedulerRef = useRef<() => void>(null);
  const drawOscilloscopeRef = useRef<() => void>(null);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      advanceStep();
    }
    timerIdRef.current = window.setTimeout(() => schedulerRef.current?.(), 25);
  }, [scheduleNote, advanceStep]);

  useEffect(() => {
    (schedulerRef as any).current = scheduler;
  }, [scheduler]);

  const triggerDiagnosticChime = useCallback(() => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) {
        addLog('error', 'DIAGNOSTIC', 'Audio context not initialized', 'error');
        return;
      }
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5 note
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6 chime sweep
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
      addLog('system', 'DIAGNOSTIC', 'Diagnostic chime played! If silent, please check that your browser tab/device is unmuted.', 'info');
    } catch (e: any) {
      addLog('error', 'DIAGNOSTIC', `Failed to play chime: ${e.message}`, 'error');
    }
  }, [initAudio, addLog]);

  const drawOscilloscope = useCallback(() => {
    const analyser = analyzerRef.current;
    if (!analyser) return;
    const data = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(data);
    setWaveformBuffer(new Float32Array(data));
    
    if (oscAnimationRef.current) {
      oscAnimationRef.current = requestAnimationFrame(() => drawOscilloscopeRef.current?.());
    }
  }, []);

  useEffect(() => {
    (drawOscilloscopeRef as any).current = drawOscilloscope;
  }, [drawOscilloscope]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
      if (oscAnimationRef.current) {
        cancelAnimationFrame(oscAnimationRef.current);
        oscAnimationRef.current = null;
      }
      setIsPlaying(false);
      setActiveStep(-1);
      setWaveformBuffer(null);
      addLog('system', 'SYSTEM', 'Playback stopped', 'info');
    } else {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      currentStepRef.current = 0;
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      setIsPlaying(true);
      scheduler();
      if (!oscAnimationRef.current) {
        oscAnimationRef.current = requestAnimationFrame(drawOscilloscope);
      }
      addLog('system', 'SYSTEM', `Playback started at ${bpm} BPM`, 'success');
    }
  }, [isPlaying, initAudio, scheduler, bpm, drawOscilloscope, addLog]);

  const toggleGridCell = useCallback((type: keyof DrumGrid, index: number) => {
    setGrid(prev => ({
      ...prev,
      [type]: prev[type].map((v, i) => i === index ? !v : v),
    }));
  }, []);

  const clearGrid = useCallback(() => {
    setGrid({
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false),
      bass: Array(16).fill(false),
    });
    addLog('system', 'SYSTEM', 'Grid cleared', 'info');
  }, [addLog]);

  const randomizeGrid = useCallback(() => {
    setGrid({
      kick: Array(16).fill(null).map(() => Math.random() > 0.6),
      snare: Array(16).fill(null).map(() => Math.random() > 0.7),
      hihat: Array(16).fill(null).map(() => Math.random() > 0.5),
      bass: Array(16).fill(null).map(() => Math.random() > 0.8),
    });
    addLog('system', 'SYSTEM', 'Random pattern generated', 'info');
  }, [addLog]);

  const loadPreset = useCallback((preset: PatternPreset) => {
    setGrid(preset.grid);
    setBpm(preset.bpm);
    addLog('system', 'SYSTEM', `Loaded preset: ${preset.name}`, 'success');
  }, [addLog]);

  const exportMIDI = useCallback(async () => {
    setIsExporting(true);
    try {
      const midi = new Midi();
      const track = midi.addTrack();
      const noteMap: Record<keyof DrumGrid, number> = { kick: 36, snare: 38, hihat: 42, bass: 35 };
      const steps = 16;
      const duration = (60 / bpm) * 4;
      for (const [type, notes] of Object.entries(grid)) {
        const midiNote = noteMap[type as keyof DrumGrid];
        for (let i = 0; i < notes.length; i++) {
          if (notes[i]) {
            const time = (i / steps) * duration;
            track.addNote({ midi: midiNote, time, duration: duration / steps, velocity: 80 });
          }
        }
      }
      const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cosmos-pattern-${Date.now()}.mid`;
      a.click();
      URL.revokeObjectURL(url);
      addLog('midi', 'MIDI', 'Pattern exported successfully', 'success');
    } catch (error) {
      addLog('error', 'ERROR', 'MIDI export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [grid, bpm, addLog]);

  const toggleRecording = useCallback(() => {
    if (!mediaDestRef.current) return;
    
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        addLog('system', 'AUDIO', 'Recording stopped, exporting WAV...', 'success');
      }
    } else {
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(mediaDestRef.current.stream);
      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cosmos-audio-${Date.now()}.wav`;
        a.click();
        URL.revokeObjectURL(url);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      addLog('system', 'AUDIO', 'Recording started', 'info');
    }
  }, [isRecording, addLog]);

  const savePattern = useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('cosmos-music-pattern', JSON.stringify({ grid, bpm, timestamp: Date.now() }));
      addLog('storage', 'STORAGE', 'Pattern saved', 'success');
    } catch {
      addLog('error', 'ERROR', 'Failed to save', 'error');
    } finally { setIsSaving(false); }
  }, [grid, bpm, addLog]);

  const loadPattern = useCallback(() => {
    setIsLoading(true);
    try {
      const data = localStorage.getItem('cosmos-music-pattern');
      if (data) {
        const parsed = JSON.parse(data);
        setGrid(parsed.grid);
        if (parsed.bpm) setBpm(parsed.bpm);
        addLog('storage', 'STORAGE', 'Pattern loaded', 'success');
      } else {
        addLog('storage', 'STORAGE', 'No saved pattern', 'warning');
      }
    } catch {
      addLog('error', 'ERROR', 'Failed to load', 'error');
    } finally { setIsLoading(false); }
  }, [addLog]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const newTimes = [...tapTimes, now].filter(t => now - t < 5000);
    setTapTimes(newTimes);
    setIsTapping(true);
    if (newTimes.length >= 3) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) intervals.push(newTimes[i] - newTimes[i - 1]);
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avgInterval);
      if (newBpm >= 40 && newBpm <= 200) {
        setBpm(newBpm);
        addLog('system', 'SYSTEM', `Tempo tapped: ${newBpm} BPM`, 'success');
      }
    }
    setTimeout(() => setIsTapping(false), 2000);
  }, [tapTimes, addLog]);

  const autoCorrelate = useCallback((buffer: Float32Array, sampleRate: number): number => {
    let SIZE = buffer.length;
    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    for (let i = SIZE - 1; i >= SIZE / 2; i--) if (Math.abs(buffer[i]) < thres) { r2 = i; break; }
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length;
    const c = new Float32Array(SIZE);
    for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - i; j++) c[i] = c[i] + buffer[j] * buffer[j + i];
    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    let T0 = maxpos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2, b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
    return sampleRate / T0;
  }, []);

  const getNoteFromFreq = useCallback((frequency: number) => {
    const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const midiNote = Math.round(noteNum) + 69;
    const noteIndex = (midiNote % 12 + 12) % 12;
    const cents = Math.round((noteNum - Math.round(noteNum)) * 100);
    return { note: noteStrings[noteIndex], cents };
  }, []);

  const toggleMic = useCallback(async () => {
    if (isMicActive) {
      if (micSourceRef.current) { micSourceRef.current.disconnect(); micSourceRef.current = null; }
      if (micAnalyserRef.current) micAnalyserRef.current = null;
      if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; }
      setIsMicActive(false);
      setDetectedNote(null);
      addLog('system', 'SYSTEM', 'Microphone stopped', 'info');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      micSourceRef.current = source;
      micAnalyserRef.current = analyser;
      setIsMicActive(true);
      addLog('system', 'SYSTEM', 'Microphone active', 'success');
      const detectPitch = () => {
        if (!micAnalyserRef.current) return;
        const buffer = new Float32Array(micAnalyserRef.current.fftSize);
        micAnalyserRef.current.getFloatTimeDomainData(buffer);
        const freq = autoCorrelate(buffer, ctx.sampleRate);
        if (freq > 50 && freq < 2000) {
          const note = getNoteFromFreq(freq);
          setDetectedNote(note);
        }
        animationFrameRef.current = requestAnimationFrame(detectPitch);
      };
      detectPitch();
    } catch (error) {
      addLog('error', 'ERROR', 'Could not access mic', 'error');
    }
  }, [isMicActive, autoCorrelate, getNoteFromFreq, addLog]);

  const generateAIPattern = useCallback(async () => {
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setGrid({
        kick: Array(16).fill(null).map(() => Math.random() > 0.55),
        snare: Array(16).fill(null).map(() => Math.random() > 0.65),
        hihat: Array(16).fill(null).map(() => Math.random() > 0.45),
        bass: Array(16).fill(null).map(() => Math.random() > 0.75),
      });
      addLog('system', 'AI', `Generated: "${aiPrompt || 'random'}"`, 'success');
    } catch {
      addLog('error', 'ERROR', 'AI failed', 'error');
    } finally { setIsGenerating(false); }
  }, [aiPrompt, addLog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.key === '1') setSelectedInstrument('kick');
      if (e.key === '2') setSelectedInstrument('snare');
      if (e.key === '3') setSelectedInstrument('hihat');
      if (e.key === '4') setSelectedInstrument('bass');
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); savePattern(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); clearGrid(); }
      if (e.key === 'r' && !e.ctrlKey) { e.preventDefault(); randomizeGrid(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, savePattern, clearGrid, randomizeGrid]);

  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(synthCutoff, audioCtxRef.current.currentTime);
    }
  }, [synthCutoff]);

  useEffect(() => {
    if (delayWetRef.current && audioCtxRef.current) {
      delayWetRef.current.gain.setValueAtTime(synthDelayMix, audioCtxRef.current.currentTime);
    }
  }, [synthDelayMix]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const drumColors = { kick: 'bg-red-500', snare: 'bg-amber-500', hihat: 'bg-cyan-400', bass: 'bg-purple-500' };
  const drumLabels = { kick: 'KICK', snare: 'SNARE', hihat: 'HIHAT', bass: 'BASS' };

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      <Lighting color={dynamicColor} intensity="soft" position="top" className="fixed inset-0 pointer-events-none" />
      
      <div className="space-y-8 pb-40">
        {/* Header & Theme */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <RealmHeader 
            icon="Music"
            title="STUDIO"
            subtitle="RETRO · High-Fidelity Audio"
            glowColor={config.glowColor}
            className="mb-0"
          />
          
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-3 rounded-full aether-glass text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-all hover:scale-105 shadow-sm">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={handleTap} className={`px-4 py-2 rounded-full aether-glass transition-all flex items-center gap-2 shadow-sm ${isTapping ? 'ring-2 ring-amber-400 text-amber-400' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:scale-105'}`}>
              <Hand className="w-4 h-4" /> Tap Tempo
            </button>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full aether-glass shadow-sm">
              <span className="text-[var(--theme-text-secondary)] text-sm font-mono">BPM</span>
              <input type="range" min="40" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-24 accent-[var(--theme-primary)] h-1" />
              <span className="text-[var(--theme-primary)] font-mono w-8">{bpm}</span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'sequencer', label: '🎹 Rhythm Engine' },
            { id: 'pitch', label: '🎤 Vocal Align' },
            { id: 'agents', label: '🤖 AI Constellation' },
            { id: 'settings', label: '⚙️ Synthesizer' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border border-transparent ${
                activeTab === tab.id 
                  ? 'bg-[var(--theme-text)] text-[var(--theme-background)] shadow-lg' 
                  : 'aether-glass text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:scale-105'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* SEQUENCER TAB */}
          {activeTab === 'sequencer' && (
            <motion.div key="seq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {/* Controls Bar */}
              <div className="flex flex-wrap justify-between items-center gap-4 aether-glass p-4 rounded-3xl shadow-sm">
                <div className="flex gap-2 items-center">
                  <button onClick={togglePlay} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2 ${isPlaying ? 'bg-red-500 text-white' : 'bg-[var(--theme-text)] text-[var(--theme-background)] hover:scale-105'}`}>
                    {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />} {isPlaying ? 'Stop' : 'Play'}
                  </button>
                  <button onClick={toggleRecording} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--theme-text)]/[0.04] text-[var(--theme-text-secondary)] hover:bg-[var(--theme-text)]/[0.08] border border-[var(--theme-border)]'}`} title="Record to WAV">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
                  </button>
                  <button onClick={triggerDiagnosticChime} className="px-4 py-2.5 rounded-full text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition-all flex items-center gap-1.5 shadow-sm" title="Troubleshoot audio output">
                    <Volume2 className="w-3.5 h-3.5" /> Test Sound (🔊)
                  </button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <button onClick={clearGrid} className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] hover:bg-[var(--theme-text)]/[0.08] text-[var(--theme-text-secondary)] transition-all flex items-center gap-1"><RotateCcw className="w-3 h-3"/> Clear</button>
                  <button onClick={randomizeGrid} className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] hover:bg-[var(--theme-text)]/[0.08] text-[var(--theme-text-secondary)] transition-all flex items-center gap-1"><Shuffle className="w-3 h-3"/> Random</button>
                  <button onClick={savePattern} className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] hover:bg-[var(--theme-text)]/[0.08] text-[var(--theme-text-secondary)] transition-all flex items-center gap-1"><Save className="w-3 h-3"/> Save</button>
                  <button onClick={loadPattern} className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] hover:bg-[var(--theme-text)]/[0.08] text-[var(--theme-text-secondary)] transition-all flex items-center gap-1"><FolderOpen className="w-3 h-3"/> Load</button>
                  <button onClick={exportMIDI} className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] hover:bg-[var(--theme-text)]/[0.08] text-[var(--theme-text-secondary)] transition-all flex items-center gap-1"><Download className="w-3 h-3"/> MIDI</button>
                </div>
              </div>

              {/* Grid Area */}
              <AetherCard variant="editorial" className="space-y-6">
                <div className="grid grid-cols-16 gap-1 md:gap-2 mb-2">
                   {Array(16).fill(0).map((_,i) => <div key={i} className="text-center text-[10px] text-[var(--theme-text-tertiary)] font-mono">{i+1}</div>)}
                </div>

                {(['kick', 'snare', 'hihat', 'bass'] as const).map(type => (
                  <div key={type} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 text-xs font-bold tracking-wider text-[var(--theme-text-secondary)]">{drumLabels[type]}</div>
                    <div className="flex-1 grid grid-cols-16 gap-1 md:gap-2">
                      {grid[type].map((active, idx) => (
                         <button
                           key={idx}
                           onClick={() => toggleGridCell(type, idx)}
                           className={`aspect-square rounded-md transition-all duration-200 ${active ? drumColors[type] + ' shadow-lg scale-105' : 'bg-[var(--theme-text)]/[0.04] hover:bg-[var(--theme-text)]/[0.08]'} ${activeStep === idx && isPlaying ? 'ring-2 ring-amber-400/80 scale-110' : ''}`}
                         />
                      ))}
                    </div>
                  </div>
                ))}
              </AetherCard>
              
              {/* Mixing Desk */}
              <Grid cols={4} gap={16}>
                {(['kick', 'snare', 'hihat', 'bass'] as const).map((type) => (
                  <GridItem span={1} key={type}>
                    <AetherCard variant="stack" className="flex flex-col items-center gap-3">
                       <span className="text-xs font-medium text-[var(--theme-text-secondary)]">{drumLabels[type]} VOL</span>
                       <input type="range" min="0" max="100" value={volumes[type]} onChange={e => setVolumes(prev => ({ ...prev, [type]: Number(e.target.value) }))} className="w-full accent-[var(--theme-primary)] h-1" />
                    </AetherCard>
                  </GridItem>
                ))}
              </Grid>

            </motion.div>
          )}

          {/* PITCH TAB */}
          {activeTab === 'pitch' && (
            <motion.div key="pitch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <Grid cols={12} gap={24}>
                 <GridItem span={12}>
                   <AetherCard variant="hero" glow className="text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
                      <button onClick={toggleMic} className={`px-8 py-4 rounded-full text-lg font-medium transition-all shadow-xl flex items-center gap-3 ${isMicActive ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--theme-text)] text-[var(--theme-background)] hover:scale-105'}`}>
                        {isMicActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />} {isMicActive ? 'Stop Listening' : 'Start Vocal Align'}
                      </button>

                      {detectedNote ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                          <div className="text-8xl font-satoshi font-light text-amber-400 tracking-tighter">{detectedNote.note}</div>
                          <div className="text-xl text-[var(--theme-text-secondary)] font-mono">{detectedNote.cents > 0 ? '+' : ''}{detectedNote.cents} cents</div>
                          <div className="w-64 h-2 bg-[var(--theme-text)]/[0.08] rounded-full overflow-hidden relative mx-auto mt-6">
                            <div className="absolute top-0 bottom-0 w-1 bg-[var(--theme-text)] left-1/2 -translate-x-1/2 z-10" />
                            <motion.div 
                              className="h-full bg-gradient-to-r from-red-400 via-amber-400 to-green-400 rounded-full"
                              animate={{ x: `${Math.max(-50, Math.min(50, detectedNote.cents))} %` }} 
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              style={{ width: '50%', originX: 0 }}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-[var(--theme-text-tertiary)] mt-8">Provide audio input to detect pitch</div>
                      )}
                   </AetherCard>
                 </GridItem>
               </Grid>
            </motion.div>
          )}

          {/* AGENTS TAB */}
          {activeTab === 'agents' && (
            <motion.div key="agents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Grid cols={12} gap={24}>
                <GridItem span={8}>
                  <AetherCard variant="editorial" className="h-full space-y-6">
                    <Label>Harmonic Compilation AI</Label>
                    <Heading size="32">Describe Your Groove</Heading>
                    <Body className="text-[var(--theme-text-secondary)]">The AI agent constellation will compile a rhythm sequence matching your description.</Body>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. 'A lofi hip hop beat with syncopated hi-hats'" className="flex-1 bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] rounded-xl px-4 py-3 text-[var(--theme-text)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                      <button onClick={generateAIPattern} disabled={isGenerating} className="px-6 py-3 rounded-xl bg-[var(--theme-text)] text-[var(--theme-background)] font-medium hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Generate
                      </button>
                    </div>

                    <div className="pt-6">
                      <Label>Or use Curated Presets</Label>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {PRESETS.map(p => (
                           <button key={p.name} onClick={() => loadPreset(p)} className="px-4 py-2 rounded-full bg-[var(--theme-text)]/[0.04] text-[var(--theme-text-secondary)] hover:bg-[var(--theme-text)]/[0.08] transition-all text-sm">{p.name}</button>
                        ))}
                      </div>
                    </div>
                  </AetherCard>
                </GridItem>
                <GridItem span={4}>
                  <AetherCard variant="stack" className="h-full space-y-4">
                    <Label>Constellation Status</Label>
                    {[
                      { name: 'Aether-9', role: 'Filter Synthesis', active: isPlaying },
                      { name: 'Rhythm.OS', role: 'Gate Sequencer', active: isPlaying },
                      { name: 'Pitch-X', role: 'Spectral Align', active: isMicActive },
                    ].map(a => (
                      <div key={a.name} className="p-4 rounded-xl bg-[var(--theme-text)]/[0.04] border border-[var(--theme-border)] flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm text-[var(--theme-text)]">{a.name}</div>
                          <div className="text-xs text-[var(--theme-text-tertiary)]">{a.role}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${a.active ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-[var(--theme-text)]/[0.2]'}`} />
                      </div>
                    ))}
                  </AetherCard>
                </GridItem>
              </Grid>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <Grid cols={12} gap={24}>
                 <GridItem span={6}>
                   <AetherCard variant="editorial" className="space-y-6 h-full">
                     <Label>Synthesizer Parameters</Label>
                     <div className="space-y-4">
                       <div>
                         <div className="flex justify-between text-sm mb-1 text-[var(--theme-text-secondary)]"><span>Filter Cutoff</span><span>{synthCutoff} Hz</span></div>
                         <input type="range" min="200" max="4000" value={synthCutoff} onChange={e => setSynthCutoff(Number(e.target.value))} className="w-full accent-[var(--theme-primary)] h-1" />
                       </div>
                       <div>
                         <div className="flex justify-between text-sm mb-1 text-[var(--theme-text-secondary)]"><span>Bass Detune</span><span>{synthDetune}¢</span></div>
                         <input type="range" min="-100" max="100" value={synthDetune} onChange={e => setSynthDetune(Number(e.target.value))} className="w-full accent-[var(--theme-primary)] h-1" />
                       </div>
                       <div>
                         <div className="flex justify-between text-sm mb-1 text-[var(--theme-text-secondary)]"><span>Bass Release</span><span>{synthRelease.toFixed(2)}s</span></div>
                         <input type="range" min="0.05" max="1" step="0.01" value={synthRelease} onChange={e => setSynthRelease(Number(e.target.value))} className="w-full accent-[var(--theme-primary)] h-1" />
                       </div>
                       <div>
                         <div className="flex justify-between text-sm mb-1 text-[var(--theme-text-secondary)]"><span>Delay Mix</span><span>{Math.round(synthDelayMix*100)}%</span></div>
                         <input type="range" min="0" max="0.8" step="0.01" value={synthDelayMix} onChange={e => setSynthDelayMix(Number(e.target.value))} className="w-full accent-[var(--theme-primary)] h-1" />
                       </div>
                     </div>
                     <div className="pt-4 border-t border-[var(--theme-border)]">
                       <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--theme-border)]">
                         <span className="text-sm text-[var(--theme-text-secondary)]">Device Sound Check</span>
                         <button onClick={triggerDiagnosticChime} className="px-4 py-2 rounded-full text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition-all flex items-center gap-1.5 shadow-sm">
                           <Volume2 className="w-3.5 h-3.5" /> Test Sound
                         </button>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-[var(--theme-text-secondary)]">Metronome Click</span>
                         <button onClick={() => setMetronomeOn(!metronomeOn)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${metronomeOn ? 'bg-green-500/20 text-green-600' : 'bg-[var(--theme-text)]/[0.04] text-[var(--theme-text-secondary)]'}`}>
                           {metronomeOn ? 'ON' : 'OFF'}
                         </button>
                       </div>
                     </div>
                   </AetherCard>
                 </GridItem>
                 <GridItem span={6}>
                   <AetherCard variant="editorial" className="space-y-6 h-full flex flex-col">
                     <Label>System Logs</Label>
                     <div className="bg-[var(--theme-text)]/[0.04] rounded-xl p-4 flex-1 min-h-[200px] overflow-y-auto space-y-2">
                        {logs.slice().reverse().map(l => (
                          <div key={l.id} className="text-[11px] font-mono flex gap-2">
                             <span className="text-[var(--theme-text-tertiary)] shrink-0">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
                             <span className="font-bold opacity-70 shrink-0">[{l.source}]</span>
                             <span className="text-[var(--theme-text-secondary)]">{l.message}</span>
                          </div>
                        ))}
                        {logs.length === 0 && <div className="text-[11px] text-[var(--theme-text-tertiary)] font-mono">System initialized. Awaiting commands...</div>}
                     </div>
                   </AetherCard>
                 </GridItem>
               </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Player */}
      <Player
        title="AETHER Sequence"
        artist={`Pattern: ${bpm} BPM`}
        isPlaying={isPlaying}
        onPlay={togglePlay}
        onPause={togglePlay}
        color={dynamicColor}
      />
    </RealmContainer>
  );
}
