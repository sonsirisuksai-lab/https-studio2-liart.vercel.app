import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu } from 'lucide-react';

const NEWS_SOURCES = [
  { id: 'dm', name: 'Daily Mail', date: 'MONDAY, APRIL 14, 2024', headline: 'GLOBAL MARKETS RALLY AS TECH SURGES', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop', color: 'bg-white', text: 'text-black' },
  { id: 'wsj', name: 'THE WALL STREET JOURNAL', date: 'TUESDAY, APRIL 15, 2024', headline: 'NEW ERA OF ARTIFICIAL INTELLIGENCE', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', color: 'bg-[#FAF9F5]', text: 'text-black' },
  { id: 'nyt', name: 'The New York Times', date: 'WEDNESDAY, APRIL 16, 2024', headline: 'SPACE EXPLORATION REACHES NEW HEIGHTS', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', color: 'bg-white', text: 'text-black' },
  { id: 'ft', name: 'FINANCIAL TIMES', date: 'THURSDAY, APRIL 17, 2024', headline: 'GLOBAL SUPPLY CHAINS STABILIZE', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop', color: 'bg-[#FFDDAA]', text: 'text-black' },
];

export default function NewsStack() {
  const [stack, setStack] = useState(NEWS_SOURCES);

  const bringToFront = (id: string) => {
    setStack(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      const newStack = [...prev];
      const item = newStack.splice(idx, 1)[0];
      newStack.push(item);
      return newStack;
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-serif overflow-hidden relative flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-50">
        <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm">
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold text-xl tracking-tighter uppercase font-sans">Newsstand</div>
        <div className="flex gap-2">
          <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Stack Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 perspective-1000">
        
        {stack.map((source, index) => {
          const isTop = index === stack.length - 1;
          const offset = stack.length - 1 - index;
          
          return (
            <motion.div
              key={source.id}
              layout
              onClick={() => !isTop && bringToFront(source.id)}
              initial={false}
              animate={{
                y: offset * 40,
                scale: 1 - offset * 0.05,
                zIndex: index,
                rotateZ: isTop ? 0 : offset % 2 === 0 ? 2 : -2,
                boxShadow: isTop ? '0 30px 60px -15px rgba(0,0,0,0.3)' : '0 10px 20px -5px rgba(0,0,0,0.1)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute w-full max-w-[380px] aspect-[3/4] ${source.color} ${source.text} rounded-sm cursor-pointer overflow-hidden border border-black/5 flex flex-col`}
              style={{
                transformOrigin: "bottom center"
              }}
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />

              <div className="p-6 flex-1 flex flex-col relative z-10">
                {/* Newspaper Header */}
                <div className="border-b-2 border-black pb-4 mb-4 text-center">
                   <p className="text-[10px] uppercase tracking-widest font-sans font-bold mb-2">{source.date}</p>
                   <h2 className="text-4xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: source.id === 'wsj' || source.id === 'ft' ? 'serif' : 'sans-serif' }}>
                     {source.name}
                   </h2>
                </div>
                
                {/* Headline */}
                <div className="mb-4 text-center">
                   <h3 className="text-3xl font-bold uppercase leading-tight mb-2">{source.headline}</h3>
                   <p className="text-sm italic text-black/60">Comprehensive coverage of today's most vital developments.</p>
                </div>
                
                {/* Image */}
                <div className="w-full flex-1 bg-gray-200 border border-black/20 overflow-hidden relative mb-4 grayscale contrast-125">
                   <img src={source.image} alt="News" className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-sans uppercase">
                      Exclusive Photo
                   </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed text-justify opacity-80 h-24 overflow-hidden border-t border-black/20 pt-4">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa.</p>
                </div>
              </div>
              
              {/* Fold gradient for realism */}
              {!isTop && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
              )}
            </motion.div>
          );
        })}

      </div>
      
      {/* Bottom Hint */}
      <div className="p-8 text-center text-sm font-sans uppercase tracking-widest text-black/50 z-50">
        Tap a paper to read
      </div>

    </div>
  );
}
