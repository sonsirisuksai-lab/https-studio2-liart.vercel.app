// packages/core/src/lib/audio-engine.ts
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private enabled = true;
  private reducedSound = false;

  // Call this on user interaction
  initialize() {
    if (this.isInitialized) return;
    if (!this.enabled) return;

    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Audio not supported');
        this.enabled = false;
        return;
      }
      this.ctx = new AudioContextClass();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize AudioContext:', error);
      this.enabled = false;
    }
  }

  setReducedSound(value: boolean) {
    this.reducedSound = value;
  }

  // Volume control based on reduced sound
  private getVolume(): number {
    if (this.reducedSound) return 0.3;
    return 1;
  }

  // Resume if suspended (Safari fix)
  private ensureContext(): AudioContext | null {
    if (!this.enabled) return null;
    
    if (!this.ctx) {
      this.initialize();
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    return this.ctx;
  }

  playNote(freq: number, duration: number = 0.3, volume: number = 0.2): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(volume * vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playCassetteInsert(): void {
    this.playNote(600, 0.06, 0.06);
    setTimeout(() => this.playNote(400, 0.06, 0.06), 80);
  }

  playPrinter(): void {
    this.playNote(300, 0.1, 0.05);
    setTimeout(() => this.playNote(320, 0.1, 0.05), 100);
  }

  playTypewriter(): void {
    this.playNote(1200, 0.03, 0.05);
  }

  // Play click sound
  playClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (error) {
      // Silent fail
    }
  }

  // Play hover sound
  playHover() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch (error) {
      // Silent fail
    }
  }

  // Play flip sound (for cards, book pages)
  playFlip() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.06 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (error) {
      // Silent fail
    }
  }

  // Play open sound
  playOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.05 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (error) {
      // Silent fail
    }
  }

  // Play close sound
  playClose() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.05 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (error) {
      // Silent fail
    }
  }

  // Play error sound
  playError() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.05 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (error) {
      // Silent fail
    }
  }

  // Play vinyl drop sound
  playVinylDrop() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const vol = this.getVolume();
    
    try {
      // Noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.1);
    } catch (error) {
      // Silent fail
    }
  }

  // Cleanup
  cleanup() {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.ctx = null;
    this.isInitialized = false;
  }
}

export const audioEngine = new AudioEngine();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    audioEngine.cleanup();
  });
}
