/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { geminiClient } from '@cosmos/core';

interface AIContextType {
  generateContent: (prompt: string, system?: string) => Promise<string>;
  streamContent: (prompt: string, onChunk: (c: string) => void) => Promise<void>;
  isGenerating: boolean;
}

const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (prompt: string, system?: string) => {
    setIsGenerating(true);
    try {
      const res = await geminiClient.generate(prompt, system);
      return res;
    } finally {
      setIsGenerating(false);
    }
  };

  const streamContent = async (prompt: string, onChunk: (c: string) => void) => {
    setIsGenerating(true);
    try {
      await geminiClient.stream(prompt, onChunk);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AIContext.Provider value={{ generateContent, streamContent, isGenerating }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used inside AIProvider');
  return ctx;
};
