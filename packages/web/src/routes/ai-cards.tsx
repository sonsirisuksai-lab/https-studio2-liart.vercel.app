import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Compass, HelpCircle, RefreshCw, Layers, ShieldAlert, Cpu } from 'lucide-react';

const AI_DECK = [
  {
    id: 1,
    name: "Luffy Core Engine",
    role: "Captain AI",
    avatar: "🍖",
    color: "from-red-500 to-orange-600",
    description: "Highly intuitive, direct, action-driven intelligence. Excels at broad goal setting and strategic direction without getting slowed down by minute details.",
    stats: { logic: 40, vision: 99, empathy: 95, defense: 85, output: 92 },
    sound: "liberty"
  },
  {
    id: 2,
    name: "Zoro Chief Vanguard",
    role: "Technical Combatant",
    avatar: "⚔️",
    color: "from-emerald-500 to-teal-600",
    description: "Cold, highly precise, task-oriented combat intelligence. Focuses entirely on performance metrics, clean compilation, and systematic problem slicing.",
    stats: { logic: 95, vision: 50, empathy: 30, defense: 98, output: 95 },
    sound: "blade"
  },
  {
    id: 3,
    name: "Nami Financial Hub",
    role: "Navigator Logic",
    avatar: "🍊",
    color: "from-orange-400 to-amber-600",
    description: "Superb analytical capability for resource tracking, budget allocations, and optimal data routes. High efficiency with strict constraints.",
    stats: { logic: 92, vision: 90, empathy: 75, defense: 60, output: 88 },
    sound: "coin"
  },
  {
    id: 4,
    name: "Robin Chronicler DB",
    role: "Archaeologist Knowledge",
    avatar: "📖",
    color: "from-purple-500 to-violet-700",
    description: "Deep historic record retrieval and multidimensional query consolidation. Perfect for searching long-term logs and archiving core memories.",
    stats: { logic: 98, vision: 85, empathy: 80, defense: 70, output: 82 },
    sound: "record"
  }
];

export default function AICards() {
  const [selectedCardId, setSelectedCardId] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'high-logic' | 'high-vision'>('all');

  const currentCard = AI_DECK.find(c => c.id === selectedCardId) || AI_DECK[0];

  const filteredDeck = AI_DECK.filter(card => {
    if (filterMode === 'high-logic') return card.stats.logic >= 90;
    if (filterMode === 'high-vision') return card.stats.vision >= 90;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans p-6 overflow-hidden relative flex flex-col justify-between">
      {/* Cosmic background particles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 opacity-80">Intelligence Deck</span>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-pink-500" />
            AI Soul Cards
          </h1>
        </div>
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
          {(['all', 'high-logic', 'high-vision'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                setFilterMode(mode);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono uppercase tracking-wider transition-colors ${
                filterMode === mode ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Card Arena */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto w-full relative z-10 py-6">
        
        {/* Holographic Deck Viewer */}
        <div className="relative w-72 h-[440px] md:w-80 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id + '-' + isFlipped}
              initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => setIsFlipped(!isFlipped)}
              className={`w-full h-full rounded-[36px] bg-gradient-to-br ${currentCard.color} p-6 flex flex-col justify-between border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer relative overflow-hidden group select-none`}
            >
              {/* Refraction Overlay */}
              <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-b from-white/20 to-transparent -rotate-12 translate-y-[-50%] pointer-events-none group-hover:translate-y-[-30%] transition-transform duration-700" />

              {!isFlipped ? (
                <>
                  {/* Card Front */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono tracking-widest text-white/70 uppercase">{currentCard.role}</span>
                    <Cpu className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="my-auto flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-6xl mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      {currentCard.avatar}
                    </div>
                    <h2 className="text-2xl font-black uppercase text-center leading-tight tracking-tight px-2">{currentCard.name}</h2>
                    <span className="text-xs font-mono uppercase bg-white/20 border border-white/10 px-3 py-1 rounded-full mt-2">Active Sentinel</span>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-mono">System Type</p>
                      <p className="text-xs font-bold font-mono tracking-wider">SOUL ENGINE v2</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono font-black">
                      #{currentCard.id}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Card Back (Radar Intelligence Specs) */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono tracking-widest text-white/70 uppercase">Intelligence Matrix</span>
                    <Brain className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="space-y-3 my-auto">
                    {Object.entries(currentCard.stats).map(([statName, val]) => (
                      <div key={statName} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-white/80">
                          <span>{statName}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-[10px] font-mono text-white/60 tracking-wider uppercase border-t border-white/10 pt-4">
                    Click to flip frontside
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Interactive instruction indicator */}
          <p className="text-center text-xs font-mono text-gray-500 mt-4 uppercase tracking-[0.2em] animate-pulse">
            Click Card to Flip Details
          </p>
        </div>

        {/* Intelligence analysis summary info board */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-center gap-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] backdrop-blur-md relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentCard.color} rounded-full blur-3xl opacity-20`} />
            
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Analysis Console</span>
            </div>

            <h3 className="text-2xl font-black uppercase mb-3 tracking-tight">{currentCard.name}</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">{currentCard.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-mono mb-1">Max Strength</p>
                <div className="flex items-center gap-1.5 font-bold text-lg text-white">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  {currentCard.stats.logic >= 90 ? 'L-9 System' : 'V-9 Optics'}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-mono mb-1">Response Speed</p>
                <div className="flex items-center gap-1.5 font-bold text-lg text-white">
                  <Compass className="w-4 h-4 text-amber-400" />
                  0.08ms Latency
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Card deck slider selector */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-6 bg-[#020205]/80 backdrop-blur-md border-t border-white/5 z-50 overflow-x-auto whitespace-nowrap flex gap-4 scrollbar-hide justify-center">
        {filteredDeck.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <button
              key={card.id}
              onClick={() => {
                setSelectedCardId(card.id);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-3 p-3 pr-6 rounded-2xl transition-all duration-300 border ${
                isSelected 
                  ? 'bg-white/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105' 
                  : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                {card.avatar}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold truncate max-w-[120px] uppercase leading-none">{card.name}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase font-mono">{card.role}</p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
