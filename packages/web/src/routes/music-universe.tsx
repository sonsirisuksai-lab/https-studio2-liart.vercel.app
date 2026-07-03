import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc, Music, Heart, ListMusic, Shuffle, Repeat } from 'lucide-react';

const PLAYLIST = [
  { id: 1, title: "Cosmic Drift", artist: "Maka Prompter", duration: "3:42", color: "from-purple-500 to-indigo-500", cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=400&auto=format&fit=crop" },
  { id: 2, title: "Aether Symphony", artist: "Soul Symphony", duration: "4:15", color: "from-pink-500 to-rose-500", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=400&auto=format&fit=crop" },
  { id: 3, title: "Luffy's Feast", artist: "Straw Hat Band", duration: "2:58", color: "from-red-500 to-orange-500", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" },
  { id: 4, title: "Zoro's Blade Whispers", artist: "Chief Vanguard", duration: "3:12", color: "from-emerald-500 to-teal-500", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop" }
];

export default function MusicUniverse() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Simulate progress when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans p-6 overflow-hidden relative flex flex-col justify-between">
      {/* Background ambient glow */}
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr ${currentTrack.color} rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-1000`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000_90%)] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[var(--theme-primary)] opacity-60">Realms of Rhythm</span>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Music className="w-6 h-6 text-indigo-400" />
            Sound Studio
          </h1>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 cursor-pointer">
          <ListMusic className="w-5 h-5" />
        </div>
      </header>

      {/* Music Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full relative z-10 pb-20">
        
        {/* Physical Form of Audio: Vinyl Deck & Cassette */}
        <div className="relative flex flex-col items-center">
          {/* Vinyl Container */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#111] border-8 border-[#222] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex items-center justify-center group">
            {/* Spinning Groove Lines */}
            <div className="absolute inset-4 rounded-full border border-white/[0.03] pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-white/[0.03] pointer-events-none" />
            <div className="absolute inset-20 rounded-full border border-white/[0.03] pointer-events-none" />
            <div className="absolute inset-28 rounded-full border border-white/[0.03] pointer-events-none" />
            
            {/* Spinning Album Cover */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-black relative flex items-center justify-center shadow-inner"
            >
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              {/* Vinyl center hole */}
              <div className="absolute w-12 h-12 bg-[#111] rounded-full border-4 border-black flex items-center justify-center">
                <div className="w-3 h-3 bg-[#05050a] rounded-full" />
              </div>
            </motion.div>

            {/* Tonearm */}
            <motion.div 
              animate={{ rotate: isPlaying ? 25 : 0 }}
              transition={{ type: "spring", stiffness: 80 }}
              style={{ originX: 0.9, originY: 0.1 }}
              className="absolute top-4 right-[-20px] w-32 h-44 pointer-events-none hidden md:block"
            >
              {/* Tonearm metal vector line representation */}
              <svg className="w-full h-full" viewBox="0 0 100 150">
                <path d="M 80 20 Q 50 10, 40 50 L 30 110" fill="none" stroke="#ccc" strokeWidth="4" strokeLinecap="round" />
                <rect x="25" y="110" width="10" height="15" rx="2" fill="#555" />
                <circle cx="80" cy="20" r="10" fill="#333" stroke="#999" strokeWidth="2" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Player Controls & Track List */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6">
          {/* Metadata */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase">{currentTrack.title}</h2>
            <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase">{currentTrack.artist}</p>
          </div>

          {/* Equalizer Waveform Simulator */}
          <div className="h-16 flex items-end justify-between gap-1 bg-black/30 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = isPlaying ? Math.floor(Math.abs(Math.sin(i * 0.4 + progress * 0.5)) * 75) + 15 : 15;
              return (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`w-2.5 rounded-full bg-gradient-to-t ${currentTrack.color} opacity-80`}
                />
              );
            })}
          </div>

          {/* Audio Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>0:00</span>
              <span>{currentTrack.duration}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full relative overflow-hidden cursor-pointer">
              <div 
                className={`h-full bg-gradient-to-r ${currentTrack.color} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Controls buttons */}
          <div className="flex justify-center items-center gap-8 py-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Shuffle className="w-5 h-5" />
            </button>

            <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white hover:scale-105 active:scale-95">
              <SkipBack className="w-5 h-5" />
            </button>

            <button 
              onClick={handlePlayPause}
              className={`w-18 h-18 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg bg-gradient-to-r ${currentTrack.color} text-white shadow-indigo-500/20`}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>

            <button onClick={handleNext} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white hover:scale-105 active:scale-95">
              <SkipForward className="w-5 h-5" />
            </button>

            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-indigo-500 cursor-pointer bg-white/10 h-1.5 rounded-full appearance-none" 
            />
            <span className="text-xs font-mono text-gray-400 w-8">{volume}%</span>
          </div>

        </div>

      </div>

      {/* Mini Playlist footer */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-4 bg-black/60 backdrop-blur-md border-t border-white/5 z-50 overflow-x-auto whitespace-nowrap flex gap-4 scrollbar-hide">
        {PLAYLIST.map((track, i) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(i);
              setProgress(0);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-3 p-2.5 pr-6 rounded-2xl transition-all duration-300 border ${
              currentTrackIndex === i 
                ? 'bg-white/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
              <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold truncate max-w-[120px] uppercase leading-none">{track.title}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase font-mono">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
