import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '../../components/aether/Glass';
import { Heading, Body, Label } from '../../components/aether/Typography';
import { FileText, Code2, LayoutTemplate } from 'lucide-react';
import { useDocumentCore } from '../context/DocumentCoreContext';
import { usePhysics } from '../shared/usePhysics';
import { playMechanicalSound } from '../shared/MechanicalSound';
import { useMatrix } from '../shared/MatrixContext';

export const Group2_DocumentCore: React.FC = React.memo(() => {
  const { activeMode, setActiveMode, docType, setDocType } = useDocumentCore();
  const { bouncySpring, fluidSpring } = usePhysics();
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [typedText, setTypedText] = React.useState('');
  const { aiEnergy, audioIntensity } = useMatrix();
  const [blueprintPaths, setBlueprintPaths] = useState<string>('');

  const sampleMd = "# SYSTEM_BOOT\n\nInitializing core modules...\nLoading cognitive patterns...\nReady.";

  // Dynamic Blueprint Generation
  useEffect(() => {
    if (activeMode !== 'projects') return;
    const generatePaths = () => {
      // Create dynamic lines based on current system state
      const e = aiEnergy / 100;
      const a = audioIntensity;
      
      const p1 = `M 10 10 L ${50 + a * 20} ${10 + e * 10} L 90 10 L 90 90 L 10 90 Z`;
      const p2 = `M 10 ${50 - a * 30} L 90 ${50 + a * 30}`;
      const p3 = `M ${50 - e * 20} 10 L ${50 + e * 20} 90`;
      
      // Some extra complex curves representing synapses
      const p4 = `M 20 20 Q ${50 + a*50} ${50 - e*20} 80 80`;
      
      setBlueprintPaths(`${p1} ${p2} ${p3} ${p4}`);
    };
    generatePaths();
    const interval = setInterval(generatePaths, 200);
    return () => clearInterval(interval);
  }, [aiEnergy, audioIntensity, activeMode]);

  const handleTypewriter = React.useCallback(() => {
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(prev => prev + sampleMd.charAt(i));
      playMechanicalSound('typewriter');
      i++;
      if (i >= sampleMd.length) clearInterval(interval);
    }, 100);
  }, []);

  const handleModeChange = (mode: any) => {
    setActiveMode(mode);
    playMechanicalSound('click');
    if (mode === 'docs' && docType === 'md') handleTypewriter();
  };

  const handleDocTypeChange = (type: any) => {
    setDocType(type);
    playMechanicalSound('click');
    if (type === 'md') handleTypewriter();
  };

  return (
    <div className={`min-h-screen p-8 pt-24 max-w-7xl mx-auto flex flex-col h-screen transition-colors duration-1000 relative ${
      activeMode === 'projects' ? 'bg-[#0f172a]' : 'bg-[#1e293b]'
    }`}>
      {/* Background (Industrial Cyber-Monochrome) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

      <header className="mb-8 relative z-10">
        <Label className="text-emerald-400 tracking-widest flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4" />
          COSMOS WORKSPACE & DOCUMENT CORE
        </Label>
        <Heading size="48" weight="300" className="text-zinc-100">Industrial Cyber-Engine</Heading>
      </header>

      <div className="flex gap-4 mb-8 border-b border-emerald-900/30 pb-4 relative z-10">
        {[
          { id: 'docs', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
          { id: 'code', label: 'Code Factory', icon: <Code2 className="w-4 h-4" /> },
          { id: 'projects', label: 'Blueprints', icon: <LayoutTemplate className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleModeChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-300 font-mono text-sm uppercase tracking-widest ${
              activeMode === tab.id 
                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
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
          {activeMode === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              <div className="flex gap-2 mb-6">
                {['pdf', 'md', 'txt', 'word'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleDocTypeChange(type)}
                    className={`px-4 py-1.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors ${
                      docType === type ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900/80 rounded-sm border border-zinc-700 relative overflow-hidden shadow-2xl">
                {/* CRT Scanline overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none z-50 opacity-20" />

                {docType === 'pdf' && (
                  <div className="flex flex-col items-center">
                    <div className="w-[500px] h-16 bg-zinc-800 rounded-t-sm shadow-xl relative z-10 flex flex-col items-center justify-center border border-zinc-600 border-b-zinc-950">
                       <div className="flex gap-2 mb-2 w-full px-4 justify-end">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                       </div>
                       <div className="w-64 h-1.5 bg-black rounded-full shadow-inner" />
                    </div>
                    <motion.div
                      className="w-[480px] bg-white text-black p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] origin-top border-x border-b border-zinc-300"
                      initial={{ height: 0, opacity: 0 }}
                      animate={isPrinting ? { height: 600, opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 3, ease: "linear" }}
                      onAnimationStart={() => { if(isPrinting) playMechanicalSound('paper'); }}
                    >
                      <h1 className="text-4xl font-serif mb-6 text-zinc-900 border-b-2 border-zinc-900 pb-2">CLASSIFIED REPORT</h1>
                      <p className="font-serif leading-relaxed text-zinc-700 text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </motion.div>
                    <button 
                      onClick={() => setIsPrinting(!isPrinting)}
                      className="mt-8 px-8 py-3 bg-zinc-800 text-emerald-400 font-mono text-sm uppercase tracking-widest hover:bg-zinc-700 border border-zinc-600 rounded-sm shadow-lg active:scale-95"
                    >
                      {isPrinting ? 'RESET PRINTER' : 'INITIATE PRINT'}
                    </button>
                  </div>
                )}

                {docType === 'md' && (
                  <div className="w-full h-full max-w-3xl text-left p-8 font-mono text-emerald-400 text-lg leading-loose relative bg-black/50 border border-emerald-900/30 rounded-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    <pre className="whitespace-pre-wrap">{typedText}<motion.span animate={{ opacity: [1,0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span></pre>
                  </div>
                )}

                {docType === 'txt' && (
                  <motion.div 
                    initial={{ rotateX: 90 }}
                    animate={{ rotateX: 0 }}
                    transition={bouncySpring}
                    className="w-[400px] h-[550px] bg-[#fdf6e3] rounded-r-md shadow-2xl relative flex"
                  >
                    {/* Spine */}
                    <div className="w-10 h-full bg-zinc-800 rounded-l-md border-r-4 border-black/20 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.5)]" />
                    <div className="flex-1 p-10 text-zinc-800 font-serif leading-8 relative">
                       {/* Ruled lines */}
                       <div className="absolute inset-0 bg-[linear-gradient(transparent_31px,#cbd5e1_32px)] bg-[size:100%_32px] pointer-events-none mt-10 opacity-60" />
                       <h2 className="text-3xl mb-6 text-red-800 uppercase tracking-widest font-bold border-b-2 border-red-800/30 inline-block">Field Notes</h2>
                       <p className="relative z-10 text-xl italic font-medium">Observation Day 42:</p>
                       <p className="relative z-10 text-xl mt-4">The signal is growing stronger.</p>
                    </div>
                  </motion.div>
                )}

                {docType === 'word' && (
                  <div className="w-[500px] h-[400px] relative perspective-1000">
                    {/* Back cover */}
                    <div className="absolute inset-0 bg-zinc-800 rounded-md shadow-lg border border-zinc-700" />
                    
                    {/* Paper sliding out */}
                    <motion.div 
                      initial={{ y: 0, x: 0, rotateZ: 0 }}
                      whileHover={{ y: -60, x: 30, rotateZ: 3 }}
                      transition={bouncySpring}
                      className="absolute inset-4 bg-zinc-100 shadow-xl p-8 rounded-sm"
                      onHoverStart={() => playMechanicalSound('paper')}
                    >
                      <div className="w-3/4 h-4 bg-zinc-300 mb-6 rounded-sm" />
                      <div className="w-full h-2 bg-zinc-200 mb-3 rounded-sm" />
                      <div className="w-full h-2 bg-zinc-200 mb-3 rounded-sm" />
                      <div className="w-5/6 h-2 bg-zinc-200 rounded-sm" />
                    </motion.div>
                    
                    {/* Front cover tab */}
                    <motion.div 
                      className="absolute inset-0 bg-blue-900 rounded-md shadow-2xl origin-bottom border border-blue-800"
                      initial={{ rotateX: 0 }}
                      whileHover={{ rotateX: -25 }}
                      transition={bouncySpring}
                    >
                       <div className="absolute top-0 right-12 w-40 h-16 bg-blue-900 border border-blue-800 border-b-0 rounded-t-md -mt-16 flex items-center px-4" />
                       <div className="p-8 font-mono text-blue-200 text-lg uppercase tracking-widest">PROJECT_ALPHA.docx</div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeMode === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center p-8"
            >
              <div className="w-full h-full border-2 border-emerald-900/50 rounded-sm overflow-hidden bg-zinc-950 flex relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                 <div className="w-72 border-r-2 border-emerald-900/50 p-6 bg-zinc-900/80">
                   <Label className="mb-6 block text-emerald-500 border-b border-emerald-900/50 pb-2">ASSEMBLY LINE_</Label>
                   <div className="space-y-3">
                     {['Component', 'Function', 'State', 'Effect'].map((item, i) => (
                       <div key={item} className="p-3 border border-zinc-700 bg-zinc-800 text-xs font-mono text-zinc-300 flex justify-between items-center shadow-inner">
                         <span>[{i}] {item}</span>
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="flex-1 relative overflow-hidden flex flex-col justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/microbial-mat.png')] opacity-90">
                   {/* Conveyor belt */}
                   <div className="w-full h-40 bg-zinc-900 border-y-4 border-zinc-700 relative overflow-hidden flex items-center shadow-2xl">
                     <motion.div 
                       animate={{ backgroundPositionX: -200 }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                       className="absolute inset-0 opacity-30"
                       style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, #3f3f46 60px, #3f3f46 120px)' }}
                     />
                     
                     {[
                       { name: '<Header />', length: 'w-48', delay: 0 },
                       { name: 'function init()', length: 'w-64', delay: 1.5 },
                       { name: 'useEffect(...)', length: 'w-56', delay: 3 }
                     ].map((block, i) => (
                       <motion.div 
                         key={i}
                         initial={{ x: -400 }}
                         animate={{ x: 1200 }}
                         transition={{ repeat: Infinity, duration: 6, ease: "linear", delay: block.delay }}
                         className={`absolute flex items-center justify-between bg-emerald-900/40 border-2 border-emerald-500 p-4 rounded-sm text-emerald-400 font-mono text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-sm ${block.length}`}
                       >
                         <div className="flex items-center gap-3">
                           <Code2 className="w-5 h-5" />
                           <span>{block.name}</span>
                         </div>
                         <div className="flex gap-1">
                           <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
                           <span className="w-2 h-2 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                         </div>
                       </motion.div>
                     ))}
                   </div>
                   
                   <div className="mt-12 text-center text-emerald-500 font-mono text-sm tracking-widest bg-emerald-900/20 px-6 py-2 rounded-sm border border-emerald-900/50">
                     SYSTEM STATUS: ASSEMBLING MODULES...
                   </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full flex items-center justify-center p-8 bg-[#0a192f] rounded-sm relative overflow-hidden border-2 border-blue-500/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
            >
              {/* Blueprint Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:50px_50px]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-4/5 h-4/5 border-2 border-blue-400/50 relative p-12 backdrop-blur-sm bg-blue-900/10"
                >
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 -translate-x-1 -translate-y-1" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 translate-x-1 -translate-y-1" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 -translate-x-1 translate-y-1" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 translate-x-1 translate-y-1" />

                  <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path 
                      d={blueprintPaths || "M 10 10 L 90 10 L 90 90 L 10 90 Z"} 
                      stroke="rgba(59,130,246,0.6)" 
                      strokeWidth="0.5" 
                      fill="none" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, d: blueprintPaths }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  <div className="relative z-20 text-blue-200 font-mono h-full flex flex-col">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 tracking-widest text-blue-100">SYSTEM_ARCHITECTURE</h2>
                      <p className="text-sm opacity-80 border-b border-blue-400/30 pb-4">REV: 2.0.4 | SCALE: 1:100 | AUTO-GENERATED</p>
                    </div>
                    
                    <div className="mt-12 grid grid-cols-2 gap-12 flex-1">
                      <div className="border-2 border-blue-400/30 p-6 bg-blue-900/20 relative">
                        <div className="absolute -top-3 left-4 bg-[#0a192f] px-2 text-xs text-blue-300 tracking-widest">FRONTEND_NODE</div>
                        <div className="h-full border border-dashed border-blue-400/50 flex items-center justify-center text-xl tracking-widest">
                          UI_LAYER
                        </div>
                      </div>
                      <div className="border-2 border-blue-400/30 p-6 bg-blue-900/20 relative">
                        <div className="absolute -top-3 left-4 bg-[#0a192f] px-2 text-xs text-blue-300 tracking-widest">BACKEND_NODE</div>
                        <div className="h-full border border-dashed border-blue-400/50 flex items-center justify-center text-xl tracking-widest">
                          LOGIC_CORE
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
