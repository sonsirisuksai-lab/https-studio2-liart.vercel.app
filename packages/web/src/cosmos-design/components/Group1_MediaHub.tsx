import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '../../components/aether/Glass';
import { Heading, Body, Label } from '../../components/aether/Typography';
import { Disc3, Image as ImageIcon, Film, Play, Pause, FastForward, Rewind } from 'lucide-react';
import { useMediaHub } from '../context/MediaHubContext';
import { usePhysics } from '../shared/usePhysics';
import { playMechanicalSound } from '../shared/MechanicalSound';
import { mulberry32 } from '../shared/prng';

// Helper to hash string to number for seed
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return hash;
};

// Pass 12 & 13: Procedural generative graphics with Deterministic Seed
const ProceduralWearAndTear: React.FC<{ type: 'vinyl' | 'vhs', intensity?: number, seedId: string }> = ({ type, intensity = 1, seedId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const prng = mulberry32(hashString(seedId + type));

    if (type === 'vinyl') {
      // Draw concentric procedural scratches
      for (let i = 0; i < 30 * intensity; i++) {
        ctx.beginPath();
        const r = prng() * (canvas.width / 2);
        const startAngle = prng() * Math.PI * 2;
        const endAngle = startAngle + (prng() * Math.PI / 4);
        ctx.arc(canvas.width / 2, canvas.height / 2, r, startAngle, endAngle);
        ctx.strokeStyle = `rgba(255,255,255,${0.02 + prng() * 0.05})`;
        ctx.lineWidth = 0.5 + prng();
        ctx.stroke();
      }
      // Dust specks
      for (let i = 0; i < 100 * intensity; i++) {
         ctx.fillStyle = `rgba(255,255,255,${0.05 + prng() * 0.1})`;
         ctx.fillRect(prng() * canvas.width, prng() * canvas.height, 1, 1);
      }
    } else if (type === 'vhs') {
      // Draw horizontal static lines and smudges
      for (let i = 0; i < 20 * intensity; i++) {
        ctx.beginPath();
        const y = prng() * canvas.height;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(0,0,0,${0.1 + prng() * 0.2})`;
        ctx.lineWidth = 1 + prng() * 3;
        ctx.stroke();
      }
      for (let i = 0; i < 5 * intensity; i++) {
         ctx.beginPath();
         ctx.arc(prng() * canvas.width, prng() * canvas.height, 10 + prng() * 30, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(255,255,255,${0.02 + prng() * 0.03})`;
         ctx.fill();
      }
    }
  }, [type, intensity, seedId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen" />;
};

import { useMatrix } from '../shared/MatrixContext';

const AudioVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = React.useState(0);
  const { setAudioIntensity } = useMatrix();

  React.useEffect(() => {
    if (!isPlaying) {
      setAudioIntensity(0);
      return;
    }
    let frame: number;
    const update = () => {
      const t = Date.now() / 100;
      setTime(t);
      // Average intensity calculation
      const val1 = Math.sin(t * 0.5 + 12 * 0.5);
      const val2 = Math.sin(t * 0.8 - 12 * 0.3);
      setAudioIntensity(Math.abs(val1 + val2) / 2); // 0 to 1
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      setAudioIntensity(0);
    };
  }, [isPlaying, setAudioIntensity]);

  return (
    <div className="flex items-end gap-1 h-12 w-full mt-4 border-b border-white/10 pb-1">
      {[...Array(24)].map((_, i) => {
        // Deterministic wave using sine functions
        const val1 = Math.sin(time * 0.5 + i * 0.5);
        const val2 = Math.sin(time * 0.8 - i * 0.3);
        const height = isPlaying ? Math.max(10, Math.abs(val1 + val2) * 20) : 4;
        
        return (
          <div
            key={i}
            className="flex-1 bg-cyan-500 rounded-t-[1px]"
            style={{ height: `${height}px`, transition: 'height 0.1s ease' }}
          />
        );
      })}
    </div>
  );
};

export const Group1_MediaHub: React.FC = React.memo(() => {
  const { activeTab, setActiveTab, isPlaying, setIsPlaying } = useMediaHub();
  const { bouncySpring } = usePhysics();
  const [activeMedia, setActiveMedia] = React.useState<string | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    playMechanicalSound('click');
  };

  const handleTab = (tab: any) => {
    setActiveTab(tab);
    playMechanicalSound('click');
  };

  return (
    <div className="min-h-screen p-8 pt-24 max-w-7xl mx-auto flex flex-col h-screen relative">
      {/* Background Neon Glow (Retro Analog Theme) */}
      <div className="absolute inset-0 bg-[#0a0a0a] -z-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <header className="mb-8 relative z-10">
        <Label className="text-cyan-400 tracking-widest flex items-center gap-2 mb-2">
          <Disc3 className="w-4 h-4 animate-spin-slow" />
          COSMOS MEDIA & ENTERTAINMENT HUB
        </Label>
        <Heading size="48" weight="300" className="text-zinc-100">Retro Analog Souls</Heading>
      </header>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 relative z-10">
        {[
          { id: 'music', label: 'Music Vinyls', icon: <Disc3 className="w-4 h-4" /> },
          { id: 'images', label: 'Polaroid Gallery', icon: <ImageIcon className="w-4 h-4" /> },
          { id: 'videos', label: 'VHS Archives', icon: <Film className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-cyan-900/40 text-cyan-200 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col md:flex-row gap-8 items-center justify-center"
            >
              <div className="relative w-80 h-80 perspective-1000">
                <motion.div
                  className="w-full h-full rounded-md shadow-2xl relative preserve-3d cursor-pointer group"
                  whileHover={{ scale: 1.05, rotateY: -10, rotateX: 10 }}
                  transition={bouncySpring}
                  onClick={() => {
                    setActiveMedia('vinyl-1');
                    playMechanicalSound('vinyl');
                  }}
                >
                  <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800" alt="Album Cover" className="w-full h-full object-cover rounded-md absolute inset-0 backface-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/10" />
                  
                  {activeMedia === 'vinyl-1' && (
                    <motion.div 
                      initial={{ x: 0 }}
                      animate={{ x: 140, rotate: isPlaying ? 360 : 0 }}
                      transition={{ 
                        x: bouncySpring,
                        rotate: { repeat: Infinity, duration: 4, ease: "linear" }
                      }}
                      className="absolute inset-0 rounded-full bg-[#111] shadow-2xl -z-10 flex items-center justify-center border-4 border-zinc-900 overflow-hidden"
                    >
                      <div className="w-24 h-24 rounded-full bg-cyan-800 flex items-center justify-center relative border border-cyan-500/30 z-10">
                         <div className="w-4 h-4 rounded-full bg-zinc-900 absolute shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                         <span className="text-[10px] font-bold text-white uppercase transform -rotate-45">Side A</span>
                      </div>
                      {/* Vinyl Grooves */}
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="absolute inset-0 rounded-full border border-white/5 m-auto" style={{ width: `${100 - i*10}%`, height: `${100 - i*10}%` }} />
                      ))}
                      {/* Procedural scratches */}
                      <ProceduralWearAndTear type="vinyl" intensity={1.5} seedId="vinyl-1-seed-xyz" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {activeMedia === 'vinyl-1' && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-6 bg-zinc-900/60 p-8 rounded-xl border border-white/10 backdrop-blur-md"
                >
                  <div>
                    <Heading size="32" className="text-zinc-100">Cosmic Journey</Heading>
                    <Body className="text-cyan-400 font-mono mt-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                       BPM: 120 • 4:32
                    </Body>
                    <AudioVisualizer isPlaying={isPlaying} />
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={() => playMechanicalSound('click')} className="p-4 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors shadow-inner">
                      <Rewind className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-cyan-500 text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button onClick={() => playMechanicalSound('click')} className="p-4 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors shadow-inner">
                      <FastForward className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center p-12"
            >
               <div className="relative w-full max-w-4xl h-[600px]">
                 {[
                   { id: 1, rot: -12, x: -100, y: -50, img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800' },
                   { id: 2, rot: 5, x: 50, y: 20, img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=800' },
                   { id: 3, rot: -5, x: 150, y: -80, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' }
                 ].map((polaroid) => (
                   <motion.div
                     key={polaroid.id}
                     drag
                     dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                     whileDrag={{ scale: 1.1, zIndex: 50, rotate: 0, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                     initial={{ rotate: polaroid.rot, x: polaroid.x, y: polaroid.y }}
                     onDragStart={() => playMechanicalSound('paper')}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f4f4f5] p-4 pb-16 shadow-2xl cursor-grab active:cursor-grabbing rounded-sm border border-zinc-200"
                     style={{ width: '280px', height: '340px' }}
                   >
                     <div className="w-full h-full relative overflow-hidden bg-zinc-800 rounded-sm shadow-inner">
                       <img src={polaroid.img} alt="Polaroid" className="w-full h-full object-cover pointer-events-none filter sepia-[0.2] contrast-125 hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)] pointer-events-none" />
                     </div>
                     <div className="absolute bottom-4 left-0 right-0 text-center text-zinc-600 font-mono text-sm border-t border-zinc-300 pt-2 mx-4 border-dashed">
                       MEMORY_{polaroid.id}.DAT
                     </div>
                   </motion.div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center"
            >
              <div className="w-[600px] h-[320px] bg-zinc-900 rounded-lg border-2 border-zinc-700 p-4 flex flex-col relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                <ProceduralWearAndTear type="vhs" intensity={1} seedId="vhs-tape-xyz" />
                {/* VHS Tape physical features */}
                <div className="flex justify-between items-center px-8 flex-1">
                  <motion.div 
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner"
                  >
                     <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-zinc-800 z-10" />
                     <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)] z-10" />
                     {/* Film strip inside - changes thickness based on play time */}
                     <motion.div 
                       className="absolute inset-0 border-black/90 rounded-full"
                       animate={{ borderWidth: isPlaying ? [16, 20] : 16 }}
                       transition={{ duration: 60, ease: "linear" }}
                     />
                  </motion.div>
                  
                  <div className="w-48 h-12 border border-zinc-700 rounded-sm bg-black/60 flex items-center justify-center text-xs font-mono text-zinc-500 tracking-widest relative overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]" />
                    T-120 [HQ]
                  </div>

                  <motion.div 
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner"
                  >
                     <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-zinc-800 z-10" />
                     <motion.div 
                       className="absolute inset-0 border-black/90 rounded-full"
                       animate={{ borderWidth: isPlaying ? [24, 16] : 24 }}
                       transition={{ duration: 60, ease: "linear" }}
                     />
                  </motion.div>
                </div>
                
                <div className="h-8 bg-black rounded border-t border-zinc-800 mt-4 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                  <div className="w-64 h-1 bg-red-900/40 rounded-full relative">
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"
                      animate={isPlaying ? { x: [0, 256] } : { x: 0 }}
                      transition={{ duration: 120, ease: "linear" }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full">
                  <div className="w-1/2">
                    <AudioVisualizer isPlaying={isPlaying} />
                  </div>
                  <button 
                    onClick={togglePlay}
                    className="px-8 py-3 bg-zinc-800 border-b-4 border-zinc-950 text-zinc-300 font-mono uppercase text-sm active:border-b-0 active:translate-y-1 hover:bg-zinc-700 transition-all rounded shadow-lg"
                  >
                    {isPlaying ? 'STOP' : 'PLAY'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
