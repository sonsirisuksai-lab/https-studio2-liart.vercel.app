import React from 'react';
import { ArchiveVault } from '@/components/cosmos/ArchiveVault';
import { motion } from 'framer-motion';

export default function ArchivePage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-widest text-[var(--theme-text)]">HISTORY VAULT</h1>
        <p className="text-white/50 text-sm tracking-widest">LOCAL LEDGER SYNC CONSOLE</p>
      </div>
      <ArchiveVault />
    </motion.div>
  );
}
