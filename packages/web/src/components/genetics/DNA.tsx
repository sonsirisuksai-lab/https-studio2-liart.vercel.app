import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { audioEngine } from '@/lib/audio-engine';
import { ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/hooks/useDevice';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DNAProps {
  traits: {
    age: number;
    height: number;
    weight: number;
    habit: string[];
    music: string[];
    language: string[];
    theme: string;
  };
}

export function DNA({ traits }: DNAProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const { device } = useDevice();
  const prefersReducedMotion = useReducedMotion();

  // Responsive sizing
  const getHelixSize = () => {
    if (!device) return 180;
    if (device.isIPhoneSE) return 100;
    if (device.isIPhone6_7_8) return 120;
    if (device.isIPhone12_13_14_15) return 140;
    if (device.isIPhoneMax_Plus) return 150;
    if (device.isIPadMini) return 160;
    if (device.isIPad11) return 200;
    if (device.isIPad12_9) return 240;
    return 180;
  };

  const helixSize = getHelixSize();
  const isMobile = device?.isIPhone || (device?.width ?? 0) < 768;
  const isTablet = device?.isIPad || (device?.width ?? 0) >= 768;
  
  // Disable animations on legacy devices or if user prefers reduced motion
  const shouldAnimate = !device?.isIPadMini2 && !prefersReducedMotion;

  const toggleZoom = () => {
    audioEngine.playVinylDrop();
    setIsZoomed(!isZoomed);
    if (!isZoomed) setSelectedGene(null);
  };

  const handleGeneClick = (gene: string) => {
    audioEngine.playClick();
    setSelectedGene(gene === selectedGene ? null : gene);
  };

  const genes = [
    { key: 'age', label: 'Age', value: traits.age, icon: '📅', color: '#FF6B35' },
    { key: 'height', label: 'Height', value: `${traits.height} cm`, icon: '📏', color: '#30D158' },
    { key: 'weight', label: 'Weight', value: `${traits.weight} kg`, icon: '⚖️', color: '#FFD60A' },
    { key: 'habit', label: 'Habits', value: traits.habit.join(', '), icon: '🏃', color: '#AF52DE' },
    { key: 'music', label: 'Music Taste', value: traits.music.join(', '), icon: '🎵', color: '#FF9500' },
    { key: 'language', label: 'Languages', value: traits.language.join(', '), icon: '🌍', color: '#5AC8FA' },
    { key: 'theme', label: 'Theme', value: traits.theme, icon: '🎨', color: '#34C759' },
  ];

  return (
    <div className={cn(
      "relative p-[var(--space-6)] rounded-2xl glass-medium border border-[var(--theme-border)] shadow-2xl transition-all overflow-hidden",
      isMobile ? "flex flex-col items-center" : "flex-row items-center gap-8"
    )} style={{ perspective: 1200 }}>
      {/* Glow highlight background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--theme-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Info Side (for tablet/desktop) or Header (for mobile) */}
      <div className={cn("relative z-10", isMobile ? "w-full mb-6" : "w-1/3 flex flex-col")}>
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🧬</span>
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-white">Biological DNA</div>
            {isTablet && <div className="text-xs text-[var(--theme-text-secondary)] mt-1">Physical encoding of user traits</div>}
          </div>
        </div>
        
        {isTablet && (
          <div className="mt-6 space-y-4">
            <p className="text-xs text-white/50 leading-relaxed">
              Synthesizing biographic markers into the digital realm. Every trait is a sequence in the helix.
            </p>
            <button
              onClick={toggleZoom}
              className="px-4 py-2 rounded-xl glass-light border border-white/10 hover:glass-medium transition-all text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              {isZoomed ? 'Back to Helix' : 'Analyze Genes'}
            </button>
          </div>
        )}
        
        {isMobile && (
          <button
            onClick={toggleZoom}
            className="absolute top-0 right-0 p-2.5 rounded-xl glass-light border border-white/10"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* DNA Helix View Area */}
      <div className={cn("relative min-h-[300px] flex items-center justify-center", isMobile ? "w-full" : "flex-1")}>
        <AnimatePresence mode="wait">
          {!isZoomed ? (
            // 3D Double Helix View
            <motion.div
              key="helix-3d"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full flex flex-col items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Spinning 3D Helix wrapper */}
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={shouldAnimate ? { rotateY: 360 } : {}}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                style={{ transformStyle: 'preserve-3d', height: helixSize * 1.5 }}
              >
                {genes.map((gene, i) => {
                  const angleOffset = (i / genes.length) * Math.PI * 2;
                  const y = (i / genes.length) * (helixSize * 1.2) + 20;

                  return (
                    <div
                      key={gene.key}
                      className="absolute w-full flex items-center justify-center"
                      style={{
                        top: `${y}px`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <motion.div
                        className="absolute cursor-pointer z-20 flex items-center justify-center"
                        style={{ transform: `rotateY(${angleOffset}rad) translateZ(${helixSize / 2}px)` }}
                        whileHover={shouldAnimate ? { scale: 1.25 } : {}}
                        onClick={() => handleGeneClick(gene.key)}
                      >
                        <div
                          className={cn(
                            "rounded-full flex items-center justify-center transition-all duration-300",
                            helixSize < 150 ? "w-7 h-7 text-xs" : "w-10 h-10 text-base",
                            selectedGene === gene.key ? 'scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'shadow-md'
                          )}
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${gene.color}, ${gene.color}44)`,
                            border: `2px solid rgba(255,255,255,0.4)`,
                            boxShadow: `0 0 15px ${gene.color}55`,
                          }}
                        >
                          {gene.icon}
                        </div>
                      </motion.div>

                      <div
                        className="absolute h-1 bg-gradient-to-r rounded-full opacity-45"
                        style={{
                          width: `${helixSize}px`,
                          background: `linear-gradient(90deg, ${gene.color} 0%, rgba(255,255,255,0.2) 50%, ${gene.color} 100%)`,
                          transform: `rotateY(${angleOffset}rad)`,
                        }}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : (
            // Zoomed In grid
            <motion.div
              key="zoomed-grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full relative z-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {genes.map((gene) => (
                  <motion.div
                    key={gene.key}
                    whileHover={shouldAnimate ? { y: -2 } : {}}
                    className={cn(
                      'p-4 rounded-xl transition-all duration-300 cursor-pointer border flex flex-col justify-between h-24',
                      selectedGene === gene.key
                        ? 'glass-premium border-[var(--theme-primary)]/50 shadow-[0_0_20px_var(--theme-glow)]'
                        : 'glass-light border-white/5 hover:glass-medium hover:border-white/10 shadow-sm'
                    )}
                    onClick={() => handleGeneClick(gene.key)}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xl">{gene.icon}</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{gene.label}</span>
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-full">
                      {gene.value || '-'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Detail Overlay */}
      <AnimatePresence>
        {selectedGene && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-premium border border-white/10 z-20 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                style={{
                  background: `radial-gradient(circle, ${genes.find(g => g.key === selectedGene)?.color}44 0%, ${genes.find(g => g.key === selectedGene)?.color}11 100%)`,
                  border: `2px solid ${genes.find(g => g.key === selectedGene)?.color}`,
                }}
              >
                {genes.find(g => g.key === selectedGene)?.icon}
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider text-[var(--theme-text-secondary)]">
                  {genes.find(g => g.key === selectedGene)?.label}
                </div>
                <div className="text-sm font-black text-white mt-0.5 leading-tight">
                  {genes.find(g => g.key === selectedGene)?.value}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
