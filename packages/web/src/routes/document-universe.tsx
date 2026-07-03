import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scroll, Shield, ShieldAlert, Map, Globe, Compass, FileText, ChevronRight, CornerDownRight, RefreshCw } from 'lucide-react';

const ARCHIVES = [
  {
    id: 1,
    title: "Thousand Sunny Blueprint",
    category: "Schematics",
    epoch: "New World",
    size: "45.8 MB",
    security: "Restricted",
    description: "Detailed system structural design of the Straw Hat flagship. Includes soldier dock system blueprints, Gaon Cannon energy routing diagram, and Adam Wood structural resistance specifications.",
    content: "SOLDIER DOCK SYSTEM:\n- Channel 0: Paddle Wheels (propulsion override)\n- Channel 1: Shiro Mokuba 1 (scout vehicle)\n- Channel 2: Mini Merry II (shopping vessel)\n- Channel 3: Shark Submerge III (exploration sub)\n- Channel 4: Kurosai Fr-U IV (motorcycle chassis)\n- Channel 5: Brachio Tank V (artillery chassis)"
  },
  {
    id: 2,
    title: "Bounty Target Matrix",
    category: "Intelligence",
    epoch: "Current",
    size: "1.2 MB",
    security: "Classified",
    description: "Real-time updates of threat index values and Marine operations reports in the immediate coordinate sector. Synchronized via global snail transmitter.",
    content: "ACTIVE WARINGS:\n- Sector 4-B: Fleet Admirals patrolling deep trench.\n- Red-hair presence detected at Coordinate [44.1, 99.8]. Avoid direct engagement unless Captain orders.\n- Bounty rates adjusted: Chief Technical Vanguard now elevated to 1,111,000,000 Berries."
  },
  {
    id: 3,
    title: "Ancient Void Century Records",
    category: "History",
    epoch: "Void Century",
    size: "824.0 MB",
    security: "Forbidden",
    description: "Fragmented historical records consolidated by Robin. Transcribed from Poneglyphs discovered across various islands of the Grand Line.",
    content: "TRANSCRIPTION FRAGMENTS:\n- ...and so the great kingdom fell into the shadows, leaving behind the unbreakable stones to tell the truth. Joy Boy promised that the day of the dawn will eventually come. The drums of liberation will beat once more..."
  }
];

export default function DocumentUniverse() {
  const [selectedDocId, setSelectedDocId] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Schematics', 'Intelligence', 'History'];

  const filteredDocs = ARCHIVES.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedDoc = ARCHIVES.find(d => d.id === selectedDocId) || ARCHIVES[0];

  return (
    <div className="min-h-screen bg-[#020608] text-cyan-50 font-sans p-6 overflow-hidden relative pb-24">
      {/* Cyan cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-cyan-950 pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">Archives & Codices</span>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Scroll className="w-6 h-6 text-cyan-400" />
            Document Universe
          </h1>
        </div>
        
        {/* Search */}
        <div className="flex gap-3 max-w-sm w-full">
          <div className="flex-1 bg-cyan-950/20 border border-cyan-900/60 rounded-2xl flex items-center px-4 py-2 text-sm backdrop-blur-md">
            <Search className="w-4 h-4 text-cyan-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search historical records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-cyan-200 placeholder:text-cyan-700 w-full"
            />
          </div>
        </div>
      </header>

      {/* Categories select */}
      <div className="flex gap-2 mb-8 relative z-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedDocId(1);
            }}
            className={`px-5 py-2 rounded-full text-xs uppercase font-bold tracking-wider border transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-cyan-500 border-cyan-500 text-cyan-950 font-black shadow-[0_4px_15px_rgba(6,182,212,0.3)]' 
                : 'bg-cyan-950/20 border-cyan-900/40 text-cyan-400 hover:text-cyan-200 hover:border-cyan-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid View */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left side document tree listing */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="text-xs font-mono text-cyan-600 uppercase tracking-widest mb-1 px-1 flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" />
            Database Node Index
          </div>
          
          <div className="space-y-3">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocId === doc.id;
              return (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-3 items-center relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white' 
                      : 'bg-cyan-950/5 border-cyan-950/60 text-cyan-400 hover:text-cyan-200 hover:border-cyan-900'
                  }`}
                >
                  <FileText className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate uppercase tracking-wide">{doc.title}</h3>
                    <p className="text-[10px] text-cyan-700 font-mono mt-0.5">{doc.category} • {doc.size}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-800 group-hover:text-cyan-500 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right side document detail content reading board */}
        <div className="lg:col-span-2">
          <div className="bg-[#030d12]/60 border border-cyan-950/80 rounded-[32px] p-6 backdrop-blur-md relative overflow-hidden flex flex-col h-full min-h-[440px]">
            {/* Corner glowing tech markers */}
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono uppercase tracking-widest text-cyan-500 border-b border-l border-cyan-950/60 rounded-tr-3xl bg-cyan-950/10">
              ⚡ Secure System
            </div>

            <div className="space-y-6 flex-1">
              {/* Category & Security Rating */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-900 text-cyan-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                  {selectedDoc.category}
                </span>
                
                <span className={`px-2.5 py-1 rounded font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 border ${
                  selectedDoc.security === 'Forbidden' 
                    ? 'bg-red-950/50 border-red-900 text-red-400' 
                    : selectedDoc.security === 'Classified' 
                      ? 'bg-amber-950/50 border-amber-900 text-amber-400' 
                      : 'bg-emerald-950/50 border-emerald-900 text-emerald-400'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {selectedDoc.security}
                </span>
              </div>

              {/* Title & Epoch info */}
              <div className="border-b border-cyan-950/80 pb-4">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-cyan-100 tracking-tight leading-tight">{selectedDoc.title}</h2>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-cyan-600 uppercase tracking-widest">
                  <span>Epoch: {selectedDoc.epoch}</span>
                  <span>Matrix Node: {selectedDoc.size}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-cyan-300 leading-relaxed text-sm italic">{selectedDoc.description}</p>

              {/* Secure content terminal */}
              <div className="bg-black/40 border border-cyan-950/80 rounded-2xl p-5 font-mono text-xs text-cyan-400/90 leading-relaxed overflow-x-auto whitespace-pre-wrap flex-1 shadow-inner relative">
                {selectedDoc.content}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
