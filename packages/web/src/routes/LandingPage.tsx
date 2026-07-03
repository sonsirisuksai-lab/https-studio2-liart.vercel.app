import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/aether/Typography';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-12 max-w-2xl"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto border-4 border-dashed border-cyan-500/30 rounded-full flex items-center justify-center text-4xl"
          >
            🌌
          </motion.div>
          <Heading size="64" className="font-black tracking-tighter">
            COSMOS <span className="text-cyan-500">OS</span>
          </Heading>
          <p className="text-white/40 text-lg">The world's first Personal Cognitive Operating System.</p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black tracking-widest uppercase text-xs hover:scale-105 transition-transform shadow-[0_0_40px_rgba(139,92,246,0.3)]"
        >
          Initialize System
        </button>
      </motion.div>
    </div>
  );
};
