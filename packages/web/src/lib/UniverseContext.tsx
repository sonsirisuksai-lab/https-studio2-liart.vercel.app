/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useCallback, useState } from 'react';
import { useRobin } from './RobinContext';
import { useRealm } from './RealmContext';

export type UniverseEventType = 
  | 'CAPTURE_INITIATED' 
  | 'CAPTURE_COMPLETED'
  | 'KNOWLEDGE_DISCOVERED'
  | 'MISSION_ACCOMPLISHED'
  | 'REALM_SHIFT'
  | 'DATABASE_SYNC'
  | 'AI_THINKING'
  | 'OBJECT_TOUCHED';

export interface UniverseEvent {
  id: string;
  type: UniverseEventType;
  payload?: any;
  timestamp: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}

export interface Broadcast {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
  type: 'discovery' | 'info' | 'alert';
}

export interface HistoryEntry {
  id: string;
  title: string;
  timestamp: number;
  type: 'creation' | 'discovery' | 'evolution' | 'alert';
  realmId: string;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  description: string;
  type: string;
  connections: string[];
}

interface UniverseContextType {
  lastEvent: UniverseEvent | null;
  dispatch: (type: UniverseEventType, payload?: any) => void;
  isUniverseStable: boolean;
  energy: number;
  evolutionLevel: number;
  universeState: 'idle' | 'active' | 'shifting' | 'alert' | 'restoring';
  restoreSystem: () => void;
  evolveSystem: () => void;
  missions: Mission[];
  broadcasts: Broadcast[];
  history: HistoryEntry[];
  knowledge: KnowledgeNode[];
}

const UniverseContext = createContext<UniverseContextType | undefined>(undefined);

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<UniverseEvent | null>(null);
  const [isUniverseStable, setIsUniverseStable] = useState(true);
  const [energy, setEnergy] = useState(100);
  const [evolutionLevel, setEvolutionLevel] = useState(1);
  const [universeState, setUniverseState] = useState<'idle' | 'active' | 'shifting' | 'alert' | 'restoring'>('idle');
  
  const [missions] = useState<Mission[]>([
    { id: '1', title: 'Neural Localization', description: 'เสถียรภาพมิติยังไม่สมบูรณ์ ต้องการการปรับจูน', progress: 65, status: 'active' },
    { id: '2', title: 'Artifact Recovery', description: 'ค้นหาวัตถุโบราณในเขตแดนความลับ', progress: 20, status: 'active' }
  ]);
  
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    { id: '1', sender: 'Robin', message: 'ตรวจพบสัญญาณแปลกปลอมในมิติ Iron Core', timestamp: 1719951600000, type: 'info' }
  ]);

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 'h1', title: 'Universe Initialized', timestamp: 1719951600000, type: 'creation', realmId: 'iron-core' },
    { id: 'h2', title: 'First Artifact Discovered', timestamp: 1719951650000, type: 'discovery', realmId: 'magic' }
  ]);

  const [knowledge] = useState<KnowledgeNode[]>([
    { id: 'k1', title: 'Neural Networks', description: 'ความรู้พื้นฐานเกี่ยวกับเครือข่ายประสาทเทียม', type: 'Technology', connections: ['k2'] },
    { id: 'k2', title: 'Quantum Computing', description: 'การคำนวณเชิงควอนตัมเพื่อการประมวลผลมิติ', type: 'Science', connections: ['k1'] }
  ]);

  const { say, setAction, setEmotion } = useRobin();
  const { realm } = useRealm();

  const addHistory = useCallback((title: string, type: HistoryEntry['type']) => {
    setHistory(prev => [
      { id: Math.random().toString(36).substr(2, 9), title, timestamp: Date.now(), type, realmId: realm.id },
      ...prev
    ]);
  }, [realm.id]);

  const addBroadcast = useCallback((message: string, type: Broadcast['type'] = 'info') => {
    setBroadcasts(prev => [
      { id: Math.random().toString(36).substr(2, 9), sender: 'Robin', message, timestamp: Date.now(), type },
      ...prev.slice(0, 4)
    ]);
  }, []);

  const restoreSystem = useCallback(() => {
    setUniverseState('restoring');
    setIsUniverseStable(false);
    say("เริ่มกระบวนการฟื้นฟูระบบ (System Restoration Initiated)...", 3000);
    addBroadcast("กำลังเตรียมการฟื้นฟู Core Energy...", "info");
    
    setTimeout(() => {
      setEnergy(100);
      setUniverseState('idle');
      setIsUniverseStable(true);
      say("ระบบฟื้นฟูเต็มกำลังแล้ว บอส พลังงานอยู่ที่ 100%", 2000);
      addBroadcast("System Restored: Core Energy at 100%", "discovery");
    }, 3000);
  }, [say, addBroadcast]);

  const evolveSystem = useCallback(() => {
    if (energy < 50) {
      say("พลังงานไม่เพียงพอสำหรับการวิวัฒนาการ บอส ต้องมีอย่างน้อย 50%", 3000);
      addBroadcast("Evolution Failed: Insufficient Energy", "alert");
      return;
    }

    setUniverseState('shifting');
    setIsUniverseStable(false);
    say("เริ่มกระบวนการวิวัฒนาการ (System Evolution Phase Initiated)...", 4000);
    addBroadcast("Dimensional Architecture Shifting...", "info");
    
    setTimeout(() => {
      setEvolutionLevel(prev => prev + 1);
      setEnergy(prev => prev - 50);
      setUniverseState('idle');
      setIsUniverseStable(true);
      say(`วิวัฒนาการสู่ระดับ ${evolutionLevel + 1} สำเร็จแล้ว บอส`, 3000);
      addBroadcast(`System Evolved to v${evolutionLevel + 1}.0`, "discovery");
    }, 4000);
  }, [energy, evolutionLevel, say, addBroadcast]);

  const dispatch = useCallback((type: UniverseEventType, payload?: any) => {
    const event: UniverseEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp: Date.now()
    };

    setLastEvent(event);

    // ─── Evolution Logic Engine ───
    switch (type) {
      case 'CAPTURE_INITIATED':
        setIsUniverseStable(false);
        setUniverseState('active');
        setEnergy(prev => Math.max(prev - 5, 0));
        setAction('thinking');
        setEmotion('focused');
        say(`กำลังสแกนวัตถุในมิติ ${realm.name}...`);
        addBroadcast(`Scanning object in ${realm.name} realm...`, 'info');
        break;

      case 'CAPTURE_COMPLETED':
        setIsUniverseStable(true);
        setUniverseState('idle');
        setEnergy(prev => Math.min(prev + 10, 100));
        setAction('idle');
        setEmotion('happy');
        say("บันทึกลงในคลังเก็บ Artifact เรียบร้อยแล้ว บอส");
        addBroadcast("Artifact recovered and indexed.", 'discovery');
        addHistory("Artifact Captured", 'discovery');
        break;

      case 'KNOWLEDGE_DISCOVERED':
        setEnergy(prev => Math.min(prev + 5, 100));
        setAction('thinking');
        setEmotion('curious');
        say("พบข้อมูลใหม่ที่น่าสนใจในหอสมุดมิติ");
        addBroadcast("New knowledge cluster discovered.", 'discovery');
        addHistory("Knowledge Discovery", 'discovery');
        break;

      case 'MISSION_ACCOMPLISHED':
        setEnergy(100);
        setAction('idle');
        setEmotion('excited');
        say("ภารกิจลุล่วง! พลังงาน Core เพิ่มขึ้นแล้ว");
        addBroadcast("Mission Accomplished! Universe Energy Peak.", 'discovery');
        addHistory("Mission Success", 'evolution');
        break;

      case 'REALM_SHIFT':
        setIsUniverseStable(false);
        setUniverseState('shifting');
        setEnergy(prev => Math.max(prev - 20, 0));
        setAction('thinking');
        setEmotion('curious');
        say(`ยินดีต้อนรับสู่ ${realm.name}, บอส`);
        addBroadcast(`Arrived in ${realm.name} Dimension.`, 'info');
        setTimeout(() => {
          setIsUniverseStable(true);
          setUniverseState('idle');
        }, 2000);
        break;

      case 'OBJECT_TOUCHED':
        setEnergy(prev => Math.min(prev + 0.1, 100));
        break;
        
      default:
        break;
    }
  }, [realm.name, say, setAction, setEmotion, addBroadcast, addHistory]);

  return (
    <UniverseContext.Provider value={{ 
      lastEvent, 
      dispatch, 
      isUniverseStable, 
      energy, 
      evolutionLevel, 
      universeState, 
      restoreSystem, 
      evolveSystem,
      missions,
      broadcasts,
      history,
      knowledge
    }}>
      {children}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const context = useContext(UniverseContext);
  if (!context) throw new Error('useUniverse must be used within UniverseProvider');
  return context;
}
