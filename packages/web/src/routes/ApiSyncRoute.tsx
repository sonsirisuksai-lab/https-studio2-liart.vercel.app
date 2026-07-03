/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NFCEngine, NFC_CHIPS_MAPPING } from '@cosmos/core';
import { useSound } from '@/hooks/useSound';
import { Glass } from '@/components/aether/Glass';

export function ApiSyncRoute({ type }: { type: 'focus' | 'nfc' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playOpen, playClick } = useSound();
  const [status, setStatus] = useState<'syncing' | 'success' | 'error'>('syncing');
  const [syncedMode, setSyncedMode] = useState<string>('');
  const [syncedColor, setSyncedColor] = useState<string>('#8B5CF6');

  useEffect(() => {
    // Play system opening audio indicator
    playOpen();

    const paramValue = type === 'focus' 
      ? searchParams.get('mode') || searchParams.get('focus')
      : searchParams.get('id') || searchParams.get('tag');

    if (!paramValue) {
      setStatus('error');
      return;
    }

    const nfcEngine = NFCEngine.getInstance();
    const matchedTag = nfcEngine.triggerExternalSync(paramValue);

    if (matchedTag) {
      setSyncedMode(matchedTag.focusMode);
      setSyncedColor(matchedTag.color);
      setStatus('success');

      // Play audio confirmation
      playClick();

      // Automatically navigate to the corresponding realm route after transition
      const timer = setTimeout(() => {
        navigate(matchedTag.path);
      }, 1800);

      return () => clearTimeout(timer);
    } else {
      setStatus('error');
    }
  }, [type, searchParams, navigate, playOpen, playClick]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${syncedColor} 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
        className="w-full max-w-md z-10"
      >
        <Glass
          blur={40}
          opacity={0.15}
          border
          glow
          className="p-8 rounded-3xl border-white/5 text-center shadow-2xl flex flex-col items-center gap-6"
          style={{ borderColor: status === 'success' ? `${syncedColor}40` : 'rgba(255, 255, 255, 0.05)' }}
        >
          {/* Status Indicator Chip */}
          <div className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            COSMOS OS · Hardware Link
          </div>

          {/* Sync Sphere Visual */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {status === 'syncing' && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-t-white/40 border-r-transparent border-b-transparent border-l-transparent"
              />
            )}
            
            {status === 'success' && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ backgroundColor: `${syncedColor}40` }}
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border"
                  style={{ 
                    backgroundColor: `${syncedColor}20`,
                    borderColor: `${syncedColor}60`,
                    boxShadow: `0 0 20px ${syncedColor}30` 
                  }}
                >
                  {syncedColor === '#30D158' ? '🩵' : '🌌'}
                </motion.div>
              </>
            )}

            {status === 'error' && (
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl">
                ⚠️
              </div>
            )}
          </div>

          {/* Main Titles */}
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-wider">
              {status === 'syncing' && 'Establishing Connection...'}
              {status === 'success' && 'Focus State Synchronized'}
              {status === 'error' && 'Sync Connection Failed'}
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              {status === 'syncing' && 'Interacting with active Apple Shortcuts automation protocols.'}
              {status === 'success' && `Successfully synchronized system layout to ${syncedMode}.`}
              {status === 'error' && 'Invalid NFC Tag ID or Apple Focus mode query payload.'}
            </p>
          </div>

          {/* Progress or status info */}
          {status === 'success' && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-full opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${syncedColor}, transparent)` }}
            />
          )}

          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-2">
            Status: {status.toUpperCase()}
          </div>
        </Glass>
      </motion.div>
    </div>
  );
}
