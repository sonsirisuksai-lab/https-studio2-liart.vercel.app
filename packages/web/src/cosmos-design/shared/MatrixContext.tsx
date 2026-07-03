/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MatrixState {
  aiEnergy: number; // 0 to 100
  setAiEnergy: React.Dispatch<React.SetStateAction<number>>;
  audioIntensity: number; // 0 to 1
  setAudioIntensity: React.Dispatch<React.SetStateAction<number>>;
}

const MatrixContext = createContext<MatrixState | undefined>(undefined);

export const MatrixProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiEnergy, setAiEnergy] = useState<number>(100);
  const [audioIntensity, setAudioIntensity] = useState<number>(0);

  return (
    <MatrixContext.Provider value={{ aiEnergy, setAiEnergy, audioIntensity, setAudioIntensity }}>
      {children}
    </MatrixContext.Provider>
  );
};

export const useMatrix = () => {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
};
