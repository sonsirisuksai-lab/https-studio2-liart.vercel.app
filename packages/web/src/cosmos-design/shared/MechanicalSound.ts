export const playMechanicalSound = (type: 'click' | 'paper' | 'typewriter' | 'vinyl' | 'incinerator') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'typewriter') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'paper') {
      // White Noise Filtered
      const bufferSize = ctx.sampleRate * 0.3; // 300ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noiseSource.start();
    } else if (type === 'vinyl') {
      // Crackle + Low freq hum
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.1, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
      
      // Crackle
      const bufferSize = ctx.sampleRate * 1.0; 
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() > 0.98 ? (Math.random() * 2 - 1) * 0.5 : 0;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseSource.start();
    } else if (type === 'incinerator') {
      // Noise + Sine Wave low freq rumbling
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      
      // AM modulation (vibrating fire effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(15, ctx.currentTime); // Fast flutter
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.5, ctx.currentTime);
      lfo.connect(lfoGain.gain);
      
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.2);
      mainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      noiseSource.connect(filter);
      filter.connect(lfoGain);
      lfoGain.connect(mainGain);
      mainGain.connect(ctx.destination);
      
      noiseSource.start();
      lfo.start();
      lfo.stop(ctx.currentTime + 1.5);
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};
