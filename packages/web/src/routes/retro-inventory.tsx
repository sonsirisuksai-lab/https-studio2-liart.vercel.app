import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Search, SlidersHorizontal, Battery, Wifi, ChevronLeft } from 'lucide-react';

const INVENTORY = [
  { id: 1, type: 'vhs', title: 'STROVA', subtitle: 'Action • 1989', color: 'bg-red-600', format: 'VHS' },
  { id: 2, type: 'vhs', title: 'DIRC', subtitle: 'Sci-Fi • 1992', color: 'bg-blue-600', format: 'VHS' },
  { id: 3, type: 'vhs', title: 'LUX', subtitle: 'Drama • 1985', color: 'bg-yellow-500', format: 'VHS' },
  { id: 4, type: 'device', title: 'Sony Walkman', subtitle: 'TPS-L2 • 1979', color: 'bg-indigo-800', format: 'Hardware' },
  { id: 5, type: 'device', title: 'Game Boy', subtitle: 'DMG-01 • 1989', color: 'bg-stone-300', format: 'Hardware' },
  { id: 6, type: 'object', title: 'Potted Plant', subtitle: 'Monstera • Desk', color: 'bg-emerald-600', format: 'Object' },
];

export default function RetroInventory() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-[#222] font-mono p-6 relative overflow-hidden flex flex-col">
      {/* Top Status Bar (Retro OS style) */}
      <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-black/10">
        <div className="flex gap-4 items-center">
          <span className="font-bold tracking-widest uppercase">SYS.INV.v2</span>
        </div>
        <div className="flex gap-4 items-center opacity-60">
          <Wifi className="w-5 h-5" />
          <Battery className="w-5 h-5" />
          <span className="font-bold">14:42</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeItem === null ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Inventory<br/>Collections</h1>
                <p className="text-slate-500 uppercase tracking-widest text-sm">6 Items Found</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center bg-black text-white">
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center hover:bg-black/5">
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 content-start">
              {INVENTORY.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={`item-${item.id}`}
                  onClick={() => setActiveItem(item.id)}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="bg-[#F0F0F0] p-4 rounded-xl border-2 border-black/5 cursor-pointer flex flex-col items-center group relative shadow-md transition-all"
                >
                  <div className="w-full flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-black/5 rounded-full">{item.format}</span>
                  </div>
                  
                  {/* Abstract Object Representation */}
                  <motion.div layoutId={`visual-${item.id}`} className="w-32 h-32 relative flex items-center justify-center mb-6">
                    {item.type === 'vhs' && (
                      <div className="w-24 h-32 bg-[#111] rounded-md border-l-4 border-gray-600 shadow-[2px_2px_10px_rgba(0,0,0,0.3)] relative flex flex-col p-2">
                        <div className={`w-full h-8 ${item.color} mt-4 flex items-center justify-center text-[8px] text-white font-bold tracking-widest uppercase`}>
                          {item.title}
                        </div>
                        <div className="flex gap-2 mt-auto mb-2 mx-auto opacity-50">
                          <div className="w-6 h-6 rounded-full bg-white/10" />
                          <div className="w-6 h-6 rounded-full bg-white/10" />
                        </div>
                      </div>
                    )}
                    {item.type === 'device' && (
                      <div className={`w-28 h-32 ${item.color} rounded-sm shadow-xl flex flex-col p-2 border-2 border-white/20`}>
                        <div className="w-full h-1/2 bg-black/20 rounded-sm mb-2" />
                        <div className="flex gap-2 mt-auto">
                           <div className="w-4 h-4 rounded-full bg-red-500" />
                           <div className="w-4 h-4 rounded-full bg-blue-500" />
                        </div>
                      </div>
                    )}
                    {item.type === 'object' && (
                      <div className="w-24 h-24 bg-orange-200 rounded-b-xl rounded-t-sm flex justify-center shadow-lg relative">
                        <div className={`absolute bottom-full w-20 h-24 ${item.color} rounded-t-full rounded-bl-full`} />
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="w-full text-center">
                    <h3 className="font-bold uppercase tracking-tight text-lg group-hover:text-blue-600">{item.title}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => setActiveItem(null)}
                className="w-12 h-12 border-2 border-black rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black text-white rounded-full">
                Object Viewer
              </div>
            </div>

            {(() => {
              const item = INVENTORY.find(i => i.id === activeItem);
              if (!item) return null;

              return (
                <div className="flex-1 flex flex-col items-center">
                  <motion.div 
                    layoutId={`visual-${item.id}`}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 mb-12 flex items-center justify-center perspective-1000"
                  >
                     {/* Same rendering but larger */}
                    {item.type === 'vhs' && (
                      <div className="w-48 h-64 bg-[#111] rounded-lg border-l-8 border-gray-600 shadow-2xl relative flex flex-col p-4 transform-style-3d">
                        <div className={`w-full h-16 ${item.color} mt-8 flex items-center justify-center text-xl text-white font-black tracking-widest uppercase`}>
                          {item.title}
                        </div>
                        <div className="w-full bg-white h-4 mt-2" />
                        <div className="flex gap-4 mt-auto mb-4 mx-auto opacity-80">
                          <div className="w-12 h-12 rounded-full bg-white/20 border-4 border-[#222]" />
                          <div className="w-12 h-12 rounded-full bg-white/20 border-4 border-[#222]" />
                        </div>
                      </div>
                    )}
                    {item.type === 'device' && (
                      <div className={`w-48 h-64 ${item.color} rounded-md shadow-2xl flex flex-col p-4 border-t-8 border-white/20`}>
                        <div className="w-full h-1/2 bg-black/40 rounded-sm mb-4 border-2 border-black/60 shadow-inner flex items-center justify-center text-white/50 text-xs uppercase font-bold tracking-widest">
                          Display
                        </div>
                        <div className="flex gap-4 mt-auto">
                           <div className="w-8 h-8 rounded-full bg-red-500 shadow-md" />
                           <div className="w-8 h-8 rounded-full bg-blue-500 shadow-md" />
                           <div className="w-8 h-8 rounded-full bg-yellow-500 shadow-md ml-auto" />
                        </div>
                      </div>
                    )}
                    {item.type === 'object' && (
                      <div className="w-40 h-40 bg-orange-200 rounded-b-2xl rounded-t-md flex justify-center shadow-2xl relative mt-20">
                        <div className={`absolute bottom-full w-48 h-48 ${item.color} rounded-t-full rounded-bl-full shadow-lg`} />
                      </div>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center w-full max-w-md bg-white p-8 rounded-2xl border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,1)]"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">{item.format}</span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">{item.title}</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest mb-6">{item.subtitle}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left border-t-2 border-black/10 pt-6">
                       <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Acquired</p>
                         <p className="font-bold">12.04.2023</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Condition</p>
                         <p className="font-bold">Mint</p>
                       </div>
                       <div className="col-span-2">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Notes</p>
                         <p className="font-medium text-sm">Original packaging included. Fully functional.</p>
                       </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
