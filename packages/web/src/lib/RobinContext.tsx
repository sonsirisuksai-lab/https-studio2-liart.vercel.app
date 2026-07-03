/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext, useCallback } from 'react';
import { RobinAction, RobinEmotion, RobinContextType } from './robin-types';

const RobinContext = createContext<RobinContextType | undefined>(undefined);

export const RobinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [action, setAction] = useState<RobinAction>('idle');
  const [emotion, setEmotion] = useState<RobinEmotion>('curious');
  const [message, setMessage] = useState<string | null>(null);

  const say = useCallback((text: string, duration = 5000) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  }, []);

  const triggerThinking = useCallback((duration = 3000) => {
    setAction('thinking');
    setEmotion('focused');
    setTimeout(() => {
      setAction('idle');
      setEmotion('happy');
    }, duration);
  }, []);

  return (
    <RobinContext.Provider value={{ action, emotion, message, setAction, setEmotion, say, triggerThinking }}>
      {children}
    </RobinContext.Provider>
  );
};

export const useRobin = () => {
  const context = useContext(RobinContext);
  if (!context) throw new Error('useRobin must be used within a RobinProvider');
  return context;
};
