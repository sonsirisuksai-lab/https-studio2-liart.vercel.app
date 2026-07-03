import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '../../components/aether/Glass';
import { Heading, Body, Label } from '../../components/aether/Typography';
import { User, Calendar, StickyNote, Box, Ticket } from 'lucide-react';
import { usePersonalSpace } from '../context/PersonalSpaceContext';
import { usePhysics } from '../shared/usePhysics';
import { playMechanicalSound } from '../shared/MechanicalSound';
import { PhysicalLoader } from '../shared/PhysicalLoader';
import { PhysicsWorkspace } from '../shared/PhysicsWorkspace';
import { BiometricMembrane } from '../shared/BiometricMembrane';

export const Group4_PersonalSpace: React.FC = React.memo(() => {
  const { activeTab, setActiveTab } = usePersonalSpace();
  const { bouncySpring, heavySpring } = usePhysics();
  const [isBoxOpen, setIsBoxOpen] = React.useState(false);
  const [isIncinerating, setIsIncinerating] = React.useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const [notesState, setNotesState] = useState([
     { id: 1, text: 'Fix the hyperdrive module', startX: 200, startY: 100, color: 'bg-yellow-100' },
     { id: 2, text: 'Call Sanji for rations', startX: 400, startY: 150, color: 'bg-rose-100' },
     { id: 3, text: 'Recalibrate navigation', startX: 600, startY: 100, color: 'bg-sky-100' }
  ]);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    playMechanicalSound('click');
  };

  const toggleBox = () => {
    setIsBoxOpen(!isBoxOpen);
    playMechanicalSound('paper');
  };

  return (
    <BiometricMembrane isLocked={!isUnlocked} onUnlock={() => setIsUnlocked(true)}>
      <div className="min-h-screen p-8 pt-24 max-w-7xl mx-auto flex flex-col h-screen relative bg-[#fdfaf6]">
        {/* Background (Organic Physical) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-50 pointer-events-none" />

        <PhysicalLoader active={isIncinerating} type="ink" />

        <header className="mb-8 relative z-10">
          <Label className="text-stone-500 tracking-widest flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            COSMOS PERSONAL SPACE & UTILITIES
          </Label>
          <Heading size="48" weight="300" className="text-stone-800">The Human Element</Heading>
        </header>

        <div className="flex flex-wrap gap-4 mb-8 border-b border-stone-300 pb-4 relative z-10">
          {[
            { id: 'dna', label: 'Genetic Profile', icon: <User className="w-4 h-4" /> },
            { id: 'timeline', label: 'Metro Map', icon: <Calendar className="w-4 h-4" /> },
            { id: 'notes', label: 'Sticky Workspace', icon: <StickyNote className="w-4 h-4" /> },
            { id: 'memory', label: 'Memory Box', icon: <Box className="w-4 h-4" /> },
            { id: 'bookmark', label: 'Tickets', icon: <Ticket className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-sans text-sm font-medium ${
                activeTab === tab.id 
                  ? 'bg-stone-800 text-stone-100 shadow-[0_5px_15px_rgba(0,0,0,0.1)]' 
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dna' && (
              <motion.div
                key="dna"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center perspective-1000"
              >
                 {/* DNA Helix Animation */}
                 <div className="relative w-full h-[600px] flex items-center justify-center preserve-3d">
                   <motion.div 
                     animate={{ rotateY: 360 }}
                     transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                     className="relative h-full flex flex-col justify-center gap-10 preserve-3d"
                   >
                     {[
                       { label: 'NAME', val: 'CAPTAIN' },
                       { label: 'ROLE', val: 'ARCHITECT' },
                       { label: 'THEME', val: 'COSMIC' },
                       { label: 'SYNC', val: 'ONLINE' },
                       { label: 'LEVEL', val: '99' }
                     ].map((node, i) => (
                       <div key={i} className="flex items-center gap-48 preserve-3d">
                         <div className="w-20 h-20 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center font-mono text-sm text-orange-800 shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
                           {node.label}
                         </div>
                         {/* Connection bar */}
                         <div className="absolute left-[4rem] right-[4rem] h-2 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full shadow-inner" />
                         <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-mono text-sm text-amber-800 shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
                           {node.val}
                         </div>
                       </div>
                     ))}
                   </motion.div>
                   
                   <div className="absolute top-10 left-10 p-8 bg-white/80 backdrop-blur-md border border-stone-200 rounded-xl shadow-xl">
                     <Label className="text-stone-800">GENETIC PROFILE: ACTIVE</Label>
                     <Body className="mt-2 text-stone-600">Organic representation of user preferences.</Body>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-white rounded-xl p-12 overflow-hidden relative shadow-lg border border-stone-200"
              >
                <h2 className="text-4xl font-bold text-stone-800 mb-12">History Transit (Metro Map)</h2>
                
                <div className="relative w-full h-[400px]">
                  {/* Metro Lines */}
                  <ProceduralTimeline />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Line 1 - Blue (Commits) */}
                    <path d="M 50 150 L 300 150 L 400 250 L 700 250" stroke="#0ea5e9" strokeWidth="16" fill="none" opacity="0.8" />
                    {/* Line 2 - Red (Chats) */}
                    <path d="M 150 50 L 150 300 L 250 400 L 600 400" stroke="#f43f5e" strokeWidth="16" fill="none" opacity="0.8" />
                  </svg>

                  {/* Stations */}
                  {[
                    { x: 150, y: 150, name: 'Initial Boot', line: 'interchange', time: '10:00 AM' },
                    { x: 300, y: 150, name: 'UI Refactor', line: 'blue', time: '11:30 AM' },
                    { x: 400, y: 250, name: 'Animation Sync', line: 'blue', time: '1:15 PM' },
                    { x: 150, y: 300, name: 'Agent Dialog', line: 'red', time: '2:45 PM' },
                    { x: 250, y: 400, name: 'Error Handled', line: 'red', time: '4:20 PM' }
                  ].map((station, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{ left: station.x, top: station.y }}
                      whileHover={{ scale: 1.15 }}
                      transition={bouncySpring}
                      onClick={() => playMechanicalSound('typewriter')}
                    >
                      <div className={`w-8 h-8 rounded-full border-4 bg-white -translate-x-1/2 -translate-y-1/2 z-10 relative cursor-pointer shadow-md
                        ${station.line === 'interchange' ? 'border-stone-800 w-12 h-12' : 
                          station.line === 'blue' ? 'border-sky-500' : 'border-rose-500'}`} 
                      />
                      <div className="absolute top-8 left-6 text-stone-800 font-sans font-bold whitespace-nowrap text-sm bg-white/95 px-3 py-1.5 rounded shadow-lg border border-stone-100">
                        <div>{station.name}</div>
                        <div className="text-xs font-normal text-stone-500">{station.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full relative overflow-hidden border border-stone-300 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] bg-[#d4c5b0] shadow-inner"
              >
                 {/* Incinerator Zone */}
                 <div className="absolute bottom-8 right-8 w-32 h-40 bg-stone-900 rounded-lg border-4 border-stone-800 flex flex-col items-center justify-start p-4 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] z-0">
                    <div className="w-full h-2 bg-red-600 rounded-full animate-pulse mb-2" />
                    <div className="text-red-500 font-mono text-xs text-center tracking-widest mt-auto">INCINERATOR</div>
                 </div>

                 {/* Pass 10: 2D Physics engine for sticky notes */}
                 <PhysicsWorkspace 
                   notes={notesState} 
                   onIncinerate={() => {
                     setIsIncinerating(true);
                     playMechanicalSound('incinerator');
                     setTimeout(() => setIsIncinerating(false), 1500);
                   }} 
                 />
              </motion.div>
            )}

            {activeTab === 'memory' && (
              <motion.div
                key="memory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="relative w-96 h-96 perspective-1000">
                  <motion.div 
                    className="w-full h-full relative cursor-pointer preserve-3d"
                    animate={{ rotateY: isBoxOpen ? -20 : 0, rotateX: isBoxOpen ? 25 : 0 }}
                    transition={heavySpring}
                    onClick={toggleBox}
                  >
                    {/* The Box Body */}
                    <div className="absolute inset-0 bg-[#8b5a2b] border-2 border-[#5c3a18] rounded-md shadow-2xl backface-hidden bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                    
                    {/* The Lid */}
                    <motion.div 
                      className="absolute inset-0 bg-[#a06631] border-2 border-[#5c3a18] rounded-md origin-top z-20 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"
                      animate={{ rotateX: isBoxOpen ? -120 : 0 }}
                      transition={bouncySpring}
                    >
                      <div className="text-[#3e240f] font-serif text-4xl font-bold tracking-widest opacity-40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">MEMORIES</div>
                    </motion.div>

                    {/* Contents pouring out */}
                    <AnimatePresence>
                      {isBoxOpen && (
                        <>
                          {[
                            { id: 1, icon: '🗝️', x: -120, y: -60, r: -45, delay: 0.1 },
                            { id: 2, icon: '🪙', x: 140, y: -90, r: 20, delay: 0.2 },
                            { id: 3, icon: '📜', x: -90, y: -140, r: -15, delay: 0.3 },
                            { id: 4, icon: '💎', x: 90, y: -170, r: 45, delay: 0.4 }
                          ].map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                              animate={{ scale: 2, x: item.x, y: item.y, rotate: item.r, opacity: 1 }}
                              exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                              transition={{ ...bouncySpring, delay: item.delay }}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl z-10 filter drop-shadow-xl"
                            >
                              {item.icon}
                            </motion.div>
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookmark' && (
              <motion.div
                key="bookmark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center p-12"
              >
                 <div className="flex flex-col gap-8 w-full max-w-2xl">
                   {[
                     { title: 'Data Visualizer', theme: 'bg-rose-700', code: 'A12-B' },
                     { title: 'Security Logs', theme: 'bg-emerald-800', code: 'C88-X' }
                   ].map((ticket, i) => (
                     <motion.div
                       key={i}
                       whileHover={{ scale: 1.03, x: 15 }}
                       transition={bouncySpring}
                       onHoverStart={() => playMechanicalSound('paper')}
                       className="w-full h-36 flex rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-pointer"
                     >
                       {/* Stub */}
                       <div className={`w-36 ${ticket.theme} flex flex-col items-center justify-center border-r-[3px] border-dashed border-white/40 relative`}>
                          <div className="absolute top-0 bottom-0 -right-2 w-4 flex flex-col justify-between py-2 z-10">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="w-4 h-4 bg-[#fdfaf6] rounded-full" />)}
                          </div>
                          <div className="font-mono text-white/90 transform -rotate-90 whitespace-nowrap tracking-widest text-lg font-bold">ADMIT ONE</div>
                       </div>
                       {/* Main Body */}
                       <div className={`flex-1 ${ticket.theme} p-8 flex flex-col justify-between relative overflow-hidden`}>
                          {/* Decorative background logo */}
                          <Ticket className="absolute right-4 bottom-4 w-32 h-32 text-black/10 -rotate-12 pointer-events-none" />
                          
                          <div className="flex justify-between items-start relative z-10">
                            <h3 className="font-serif text-3xl font-bold text-white tracking-wide">{ticket.title}</h3>
                            <span className="font-mono text-white/60 text-xl">{ticket.code}</span>
                          </div>
                          <div className="text-white/80 text-sm tracking-widest uppercase relative z-10 font-bold bg-black/20 self-start px-3 py-1 rounded">Valid for 24h</div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BiometricMembrane>
  );
});

// Pass 12: Procedural Generative Graphics for Timeline blemishes
const ProceduralTimeline = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw coffee stains and map wear
    for (let i=0; i<5; i++) {
       ctx.beginPath();
       ctx.arc(
         Math.random() * canvas.width, 
         Math.random() * canvas.height, 
         20 + Math.random() * 40, 
         0, Math.PI * 2
       );
       ctx.fillStyle = `rgba(139, 69, 19, ${0.02 + Math.random() * 0.03})`; // faint brown
       ctx.fill();
    }
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-multiply" />;
};
