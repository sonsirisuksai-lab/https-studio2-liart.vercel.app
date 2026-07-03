import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { Gift, ChevronRight, X, Sparkles } from 'lucide-react';

const CARDS = [
  { id: 1, type: 'amazon', title: '50% CASHBACK', subtitle: 'On Amazon purchases', color: 'from-orange-400 to-yellow-500', logo: 'A', dark: true },
  { id: 2, type: 'spotify', title: '3 MONTHS FREE', subtitle: 'Spotify Premium', color: 'from-green-400 to-emerald-600', logo: 'S', dark: false },
  { id: 3, type: 'netflix', title: '1 MONTH FREE', subtitle: 'Netflix Standard', color: 'from-red-500 to-red-700', logo: 'N', dark: false },
];

export default function RewardsEngine() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isActivated, setIsActivated] = useState(false);

  const y = useMotionValue(0);
  const yInput = [-100, 0, 150];
  const opacity = useTransform(y, yInput, [0.5, 1, 0.5]);
  const scale = useTransform(y, yInput, [0.9, 1, 0.95]);
  const rotateX = useTransform(y, yInput, [10, 0, -20]);
  
  const controls = useAnimation();

  const handleDragEnd = async (e: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      // Activated
      setIsActivated(true);
      await controls.start({ y: 800, opacity: 0, transition: { duration: 0.5 } });
      // Reset after a while for demo
      setTimeout(() => {
        setIsActivated(false);
        setActiveCard(null);
        y.set(0);
        controls.set({ y: 0, opacity: 1 });
      }, 3000);
    } else {
      // Snap back
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      {activeCard === null ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 p-6 flex flex-col"
        >
          <header className="flex justify-between items-center mb-12 mt-4">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <X className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
              ))}
            </div>
          </header>

          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] rotate-12">
              <Gift className="w-8 h-8 text-black -rotate-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4 tracking-tight">Choose your<br/>welcome gift</h1>
            <p className="text-gray-400">Select one of the following rewards to get started with your new account.</p>
          </div>

          <div className="grid gap-4 flex-1">
            {CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCard(card.id)}
                className={`relative overflow-hidden p-6 rounded-3xl text-left bg-gradient-to-br ${card.color} shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`} />
                <div className={`relative z-10 ${card.dark ? 'text-black' : 'text-white'}`}>
                  <div className="text-4xl font-black mb-1 opacity-20">{card.logo}</div>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{card.title}</h3>
                  <p className="opacity-80 font-medium">{card.subtitle}</p>
                </div>
                <div className={`absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 ${card.dark ? 'text-black' : 'text-white'}`}>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center relative p-6 h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button 
            onClick={() => setActiveCard(null)}
            className="absolute top-10 left-6 w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 z-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <AnimatePresence>
            {!isActivated && (
              <motion.div 
                className="absolute top-32 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2">Drag down to</h2>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">Activate Offer</h2>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActivated && (
              <motion.div 
                className="absolute top-1/3 text-center z-40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-2 text-white">Activated!</h2>
                <p className="text-gray-400">Your reward has been applied.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full max-w-sm aspect-[3/4] perspective-1000 mt-20">
             {/* Slot element */}
             <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black rounded-full blur-sm opacity-50 z-0" />
             <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[90%] h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-full z-20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />

            <motion.div
              className="w-full h-full cursor-grab active:cursor-grabbing z-10"
              style={{ y, opacity, scale, rotateX }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              animate={controls}
            >
              {(() => {
                const card = CARDS.find(c => c.id === activeCard);
                if (!card) return null;
                return (
                  <div className={`w-full h-full rounded-[40px] bg-gradient-to-br ${card.color} p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden`}>
                     {/* Glossy reflection */}
                     <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-b from-white/30 to-transparent -rotate-12 translate-y-[-50%] pointer-events-none" />
                     
                     <div className={`mt-auto relative z-10 ${card.dark ? 'text-black' : 'text-white'}`}>
                        <div className="text-8xl font-black mb-4 opacity-20">{card.logo}</div>
                        <h3 className="text-4xl font-black mb-2 leading-none tracking-tight">{card.title}</h3>
                        <p className="text-lg opacity-80 font-medium">{card.subtitle}</p>
                     </div>

                     {/* Physical card details like chip or numbers could go here */}
                     <div className="absolute top-8 left-8 w-12 h-8 rounded-md bg-white/20 border border-white/30 backdrop-blur-sm" />
                  </div>
                );
              })()}
            </motion.div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
