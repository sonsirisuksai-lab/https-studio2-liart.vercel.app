import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '../../components/aether/Glass';
import { Heading, Body, Label } from '../../components/aether/Typography';
import { Brain, Sparkles, BookOpen, Cpu } from 'lucide-react';
import { useAiCenter } from '../context/AiCenterContext';
import { usePhysics } from '../shared/usePhysics';
import { playMechanicalSound } from '../shared/MechanicalSound';
import { PhysicalLoader } from '../shared/PhysicalLoader';
import { BiometricMembrane } from '../shared/BiometricMembrane';
import { useMatrix } from '../shared/MatrixContext';

export const Group3_AiCenter: React.FC = React.memo(() => {
  const { activeTab, setActiveTab, isThinking, setIsThinking } = useAiCenter();
  const { bouncySpring } = usePhysics();
  const { aiEnergy, setAiEnergy, audioIntensity } = useMatrix();
  const [flippedCard, setFlippedCard] = React.useState<string | null>(null);
  const [unlockedCards, setUnlockedCards] = React.useState<Record<string, boolean>>({});
  const [synapseWeight, setSynapseWeight] = useState(1);

  useEffect(() => {
    let interval: number;
    if (isThinking) {
      interval = window.setInterval(() => {
        setAiEnergy(prev => Math.max(0, prev - 20));
      }, 500);
    } else {
      interval = window.setInterval(() => {
        setAiEnergy(prev => Math.min(100, prev + 5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isThinking, setAiEnergy]);

  const simulateThinking = () => {
    setIsThinking(true);
    playMechanicalSound('click');
    setTimeout(() => setIsThinking(false), 3000);
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    playMechanicalSound('click');
  };

  const unlockCard = (name: string) => {
    setUnlockedCards(prev => ({ ...prev, [name]: true }));
  };

  return (
    <div className="min-h-screen p-8 pt-24 max-w-7xl mx-auto flex flex-col h-screen relative bg-[#050505]">
      {/* Background (Ethereal Cosmic Neon) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
      
      {/* Inter-component Synapses Pulse Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 animate-[pulse_4s_ease-in-out_infinite] z-50 pointer-events-none" />

      {/* Inter-connected Energy Matrix: Audio Intensity -> Ink Bleeding */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center filter blur-3xl opacity-30">
        <motion.div 
          className="bg-cyan-500 rounded-full mix-blend-screen"
          animate={{
            width: `${100 + audioIntensity * 500}px`,
            height: `${100 + audioIntensity * 500}px`,
            opacity: audioIntensity > 0.1 ? 0.5 + audioIntensity * 0.5 : 0
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
        <motion.div 
          className="absolute bg-purple-600 rounded-full mix-blend-screen"
          animate={{
            width: `${50 + audioIntensity * 800}px`,
            height: `${50 + audioIntensity * 800}px`,
            opacity: audioIntensity > 0.1 ? 0.3 + audioIntensity * 0.5 : 0
          }}
          transition={{ duration: 0.2, ease: "linear" }}
        />
      </div>

      <header className="mb-8 flex justify-between items-end relative z-10">
        <div>
          <Label className="text-purple-400 tracking-widest flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4" />
            COSMOS AI CENTER & KNOWLEDGE MAPPING
          </Label>
          <Heading size="48" weight="300" className="text-zinc-100">Neural Cartography</Heading>
        </div>
        
        <button 
          onClick={simulateThinking}
          className="px-6 py-3 bg-purple-600/20 text-purple-300 border border-purple-500/50 rounded-full font-mono text-sm hover:bg-purple-600/40 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        >
          <Sparkles className="w-4 h-4" />
          INITIATE SYNTHESIS
        </button>
      </header>

      <PhysicalLoader active={isThinking} type="origami" />

      <div className="flex gap-4 mb-8 border-b border-purple-900/30 pb-4 relative z-10">
        {[
          { id: 'agent', label: 'AI Trading Cards', icon: <Cpu className="w-4 h-4" /> },
          { id: 'knowledge', label: 'Brain Mapping', icon: <Brain className="w-4 h-4" /> },
          { id: 'prompt', label: 'Recipe Book', icon: <BookOpen className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-mono text-sm tracking-widest ${
              activeTab === tab.id 
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'agent' && (
            <motion.div
              key="agent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center perspective-1000"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { name: 'Claude', energy: '98%', mood: 'ANALYTICAL', color: 'indigo' },
                  { name: 'Gemini', energy: '92%', mood: 'CREATIVE', color: 'orange' },
                  { name: 'DeepSeek', energy: '85%', mood: 'LOGICAL', color: 'blue' }
                ].map((agent) => (
                  <div key={agent.name} className="w-80 h-[480px] relative preserve-3d cursor-pointer group" onClick={() => {
                    if (unlockedCards[agent.name]) {
                      setFlippedCard(flippedCard === agent.name ? null : agent.name);
                      playMechanicalSound('paper');
                    }
                  }}>
                    <BiometricMembrane 
                      isLocked={!unlockedCards[agent.name]} 
                      onUnlock={() => unlockCard(agent.name)}
                    >
                      <motion.div
                        className="absolute inset-0 w-full h-full preserve-3d"
                        animate={{ rotateY: flippedCard === agent.name ? 180 : 0 }}
                        transition={bouncySpring}
                        whileHover={{ scale: 1.05, y: -10 }}
                      >
                        {/* Aura Glow */}
                        <div className={`absolute -inset-4 bg-${agent.color}-500/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                          <div className="w-full text-center border-b border-zinc-800 pb-4">
                             <div className={`text-2xl font-bold uppercase tracking-widest text-${agent.color}-400 mb-1`}>{agent.name}</div>
                             <div className="text-xs text-zinc-500 tracking-widest">COGNITIVE ENTITY // TIER 1</div>
                          </div>
                          <div className={`w-40 h-40 rounded-full bg-zinc-900 border-4 border-${agent.color}-900 flex items-center justify-center overflow-hidden relative shadow-inner`}>
                            <div className={`w-full h-full bg-[radial-gradient(circle,var(--theme-primary)_0%,transparent_70%)] opacity-30 blur-xl absolute`} />
                            <Cpu className={`w-12 h-12 text-${agent.color}-500 opacity-50`} />
                          </div>
                          <div className="w-full grid grid-cols-2 gap-4 text-center">
                             <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                               <div className="text-xs text-zinc-500 mb-1">ENERGY</div>
                               <div className="font-mono text-lg text-zinc-300">{agent.energy}</div>
                             </div>
                             <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                               <div className="text-xs text-zinc-500 mb-1">STATE</div>
                               <div className={`font-mono text-lg text-${agent.color}-400`}>{agent.mood}</div>
                             </div>
                          </div>
                        </div>

                        {/* Back */}
                        <div className={`absolute inset-0 backface-hidden bg-zinc-950 rounded-2xl border border-${agent.color}-500/50 p-8 flex flex-col shadow-[0_0_30px_rgba(139,92,246,0.15)] z-10`} style={{ transform: 'rotateY(180deg)' }}>
                           <div className={`text-sm font-mono text-${agent.color}-400 mb-6 border-b border-zinc-800 pb-3 tracking-widest`}>CORE_CONFIGURATION</div>
                           <div className="space-y-6 flex-1">
                             <div>
                               <div className="text-xs text-zinc-500 mb-2 tracking-widest">SYSTEM_PROMPT</div>
                               <div className="text-sm text-zinc-300 font-serif leading-relaxed italic bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                 "Analyze input data. Provide logical deduction and ensure structural integrity. Minimize latency."
                               </div>
                             </div>
                             <div>
                               <div className="text-xs text-zinc-500 mb-2 tracking-widest">MEMORY_ALLOCATION</div>
                               <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                                 <div className={`w-[${agent.energy}] bg-${agent.color}-500 h-full`} />
                               </div>
                             </div>
                             <div>
                               <div className="text-xs text-zinc-500 mb-2 tracking-widest">TEMPERATURE_COEFFICIENT</div>
                               <div className={`font-mono text-3xl text-${agent.color}-400`}>0.2<span className="text-lg text-zinc-600">/1.0</span></div>
                             </div>
                           </div>
                        </div>
                      </motion.div>
                    </BiometricMembrane>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex flex-col items-center justify-center relative overflow-hidden"
            >
               <button 
                 onClick={() => { setSynapseWeight(prev => Math.min(prev + 1, 5)); playMechanicalSound('click'); }} 
                 className="absolute top-4 right-4 z-50 text-xs font-mono text-purple-400 bg-purple-900/30 p-2 rounded border border-purple-500/30 hover:bg-purple-900/60"
               >
                 [SIMULATE USAGE]
               </button>
               {/* 3D Brain Mapping Representation */}
               <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
                  
                  {/* Left Hemisphere (Language) */}
                  <motion.div 
                    className="absolute left-1/4 top-1/3 w-40 h-40 border border-blue-500/30 rounded-full flex items-center justify-center bg-blue-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  >
                    <span className="text-blue-400 font-mono text-sm tracking-widest">LANGUAGE_NODE</span>
                  </motion.div>

                  {/* Hippocampus (Memory) */}
                  <motion.div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-purple-500/50 rounded-full flex items-center justify-center bg-purple-500/10 backdrop-blur-xl z-20 shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <span className="text-purple-300 font-mono text-base font-bold tracking-widest text-center">
                      MEMORY_CORE<br/>
                      <span className="text-xs text-purple-500 font-normal">HIPPOCAMPUS</span>
                    </span>
                  </motion.div>

                  {/* Occipital Lobe (Vision) */}
                  <motion.div 
                    className="absolute right-1/4 bottom-1/3 w-32 h-32 border border-emerald-500/30 rounded-full flex items-center justify-center bg-emerald-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  >
                    <span className="text-emerald-400 font-mono text-sm tracking-widest">VISION_NODE</span>
                  </motion.div>

                  {/* Neural Pulses (Connecting lines) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ zIndex: 10 }}>
                    <motion.path
                      d="M 400 250 Q 450 300 500 300"
                      stroke={`rgba(59,130,246,${0.2 + synapseWeight * 0.15})`}
                      strokeWidth={1 + synapseWeight}
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    <motion.circle
                      cx="0" cy="0" r={4 + synapseWeight} fill="#60a5fa"
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      style={{ offsetPath: "path('M 400 250 Q 450 300 500 300')", filter: "blur(2px)" }}
                      transition={{ repeat: Infinity, duration: Math.max(0.5, 2 - synapseWeight * 0.3), ease: "linear" }}
                    />
                    <motion.circle
                      cx="0" cy="0" r="2" fill="#fff"
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      style={{ offsetPath: "path('M 400 250 Q 450 300 500 300')" }}
                      transition={{ repeat: Infinity, duration: Math.max(0.5, 2 - synapseWeight * 0.3), ease: "linear" }}
                    />
                    
                    <motion.path
                      d="M 600 300 Q 650 300 700 400"
                      stroke={`rgba(16,185,129,${0.2 + synapseWeight * 0.15})`}
                      strokeWidth={1 + synapseWeight}
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    <motion.circle
                      cx="0" cy="0" r={4 + synapseWeight} fill="#34d399"
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      style={{ offsetPath: "path('M 600 300 Q 650 300 700 400')", filter: "blur(2px)" }}
                      transition={{ repeat: Infinity, duration: Math.max(0.5, 2.5 - synapseWeight * 0.3), ease: "linear", delay: 1 }}
                    />
                  </svg>
               </div>
            </motion.div>
          )}

          {activeTab === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center p-12"
            >
               {/* Recipe Book Style */}
               <div className="w-full max-w-5xl h-[600px] flex bg-[#fffcf5] rounded-md shadow-[30px_30px_60px_rgba(0,0,0,0.5)] overflow-hidden relative border border-stone-200">
                 {/* Book binding */}
                 <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-stone-300 via-stone-400 to-stone-300 border-l border-r border-stone-400 z-10 shadow-inner" />
                 
                 {/* Left Page (Ingredients / Parameters) */}
                 <div className="flex-1 p-16 text-stone-800 relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                    <h2 className="text-4xl font-serif mb-10 text-stone-800 border-b-2 border-stone-800 pb-4 italic">Summarizer Formula</h2>
                    
                    <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-stone-500 mb-6 bg-[#fffcf5] inline-block pr-4">Ingredients</h3>
                    <ul className="list-disc list-inside font-serif text-xl space-y-5 text-stone-700">
                      <li>1x User Document <span className="text-stone-400 text-sm">(Raw)</span></li>
                      <li>Temperature: 0.1 <span className="text-stone-400 text-sm">(Chilled)</span></li>
                      <li>Tone: Professional</li>
                      <li>Format: Bullet points</li>
                    </ul>
                 </div>

                 {/* Right Page (Instructions / Prompt) */}
                 <div className="flex-1 p-16 text-stone-800 relative bg-[#f5f0e6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                    <h3 className="font-sans font-bold uppercase tracking-widest text-sm text-stone-500 mb-6 bg-[#f5f0e6] inline-block pr-4 mt-6">The Prompt Instruction</h3>
                    <p className="font-serif text-2xl leading-relaxed italic text-stone-800 mb-12">
                      "Analyze the provided text. Extract the core arguments and present them in a concise, bulleted list. Maintain a neutral, professional tone throughout."
                    </p>

                    <div className="border-2 border-dashed border-stone-400 p-8 rounded bg-[#fffcf5]">
                      <div className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-4">Expected Output Shape</div>
                      <div className="font-sans text-base text-stone-600 space-y-2">
                        <div className="h-2 w-3/4 bg-stone-300 rounded" />
                        <div className="h-2 w-full bg-stone-300 rounded" />
                        <div className="h-2 w-5/6 bg-stone-300 rounded" />
                      </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
