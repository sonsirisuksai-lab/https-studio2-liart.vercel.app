/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { Glass } from '@/components/aether/Glass';
import { useSound } from '@/hooks/useSound';
import { EntityEngine } from '@/lib/entity-engine';
import { geminiClient } from '@/lib/ai/gemini';
import { NFCEngine } from '@cosmos/core';
import Matter from 'matter-js';

import { Tuner } from './Tuner';
import { MIDIExport } from './MIDIExport';
import { Analyzer } from './Analyzer';
import { ChordGenerator } from './ChordGenerator';
import { Composer } from './Composer';
import { GuitarTrainer } from './GuitarTrainer';
import { Heading } from '@/components/aether/Typography';

// Entity type interfaces
interface Inspiration {
  id: string;
  type: 'fusion_inspiration';
  title: string;
  content: string; // Description
  realm: string; // e.g. 'CORE', 'WORK', 'THINK', 'STUDIO', 'LIFE', 'SIGNAL', 'MONEY'
  tags: string[];
  metadata: {
    imageUrl?: string;
    notes?: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Future';
  };
  createdAt: number;
}

interface DBField {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'BOOLEAN' | 'UUID' | 'TIMESTAMP' | 'JSONB';
  isPrimaryKey: boolean;
  isNullable: boolean;
}

interface Proposal {
  id: string;
  type: 'fusion_proposal';
  title: string;
  content: string; // Description
  realm: string;
  tags: string[];
  metadata: {
    purpose: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Future';
    userStory: string;
    interaction: string;
    automation: string;
    physicalMapping: 'Vinyl' | 'Cassette' | 'Soul Card' | 'DNA' | 'Memory Card' | 'Planet' | 'Artifact' | 'Crystal' | 'Notebook';
    aiCrew: string;
    nfc: string;
    anytype: string;
    obsidian: string;
    clickUp: 'Backlog' | 'Designing' | 'In-Progress' | 'Active';
    databaseFields?: string; // JSON representation of fields
    implementation: string;
    roadmapVersion: 'Version 6' | 'Version 7' | 'Version 8' | 'Version 9' | 'Version 10';
    verdict?: string;
  };
  createdAt: number;
}

// Helper to pick a random item stably
const getStableRandomMapping = (items: string[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

export function StudioPro() {
  const { playClick, playHover, playFlip, playOpen } = useSound();
  const [activeTab, setActiveTab] = useState<'inspiration' | 'proposal' | 'roadmap' | 'sandbox' | 'studio_pro_features'>('inspiration');
  const [activeSubFeature, setActiveSubFeature] = useState<'tuner' | 'midi' | 'analyzer' | 'chords' | 'composer' | 'trainer'>('tuner');
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  
  // Input fields for Inspiration
  const [inspTitle, setInspTitle] = useState('');
  const [inspDesc, setInspDesc] = useState('');
  const [inspUrl, setInspUrl] = useState('');
  const [inspRealm, setInspRealm] = useState('STUDIO');
  const [inspPriority, setInspPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low' | 'Future'>('High');
  const [inspNotes, setInspNotes] = useState('');
  
  // Selected details
  const [selectedInsp, setSelectedInsp] = useState<Inspiration | null>(null);
  const [selectedProp, setSelectedProp] = useState<Proposal | null>(null);
  
  // Zoro AI Advice Box
  const [zoroAdvice, setZoroAdvice] = useState<string>(
    'ฉันกำลังเฝ้าดูอยู่บอส ส่งไอเดียหรือแรงบันดาลใจเข้ามาสิ ฉันจะประเมินเองว่าฟังก์ชันไหนที่ควรค่าแก่การเสียบกระดาษเขียนโค้ด หรือฟังก์ชันไหนที่เป็นแค่ขยะเสื่อมความสามารถ!'
  );
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Dynamic code sandbox values
  const [customFields, setCustomFields] = useState<DBField[]>([
    { name: 'id', type: 'UUID', isPrimaryKey: true, isNullable: false },
    { name: 'realm', type: 'TEXT', isPrimaryKey: false, isNullable: false },
    { name: 'title', type: 'TEXT', isPrimaryKey: false, isNullable: false },
    { name: 'config', type: 'JSONB', isPrimaryKey: false, isNullable: true },
    { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isNullable: false }
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<DBField['type']>('TEXT');
  const [newFieldNullable, setNewFieldNullable] = useState(true);

  // NFC Simulation status
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcTriggeredText, setNfcTriggeredText] = useState<string | null>(null);
  const [hardwareSupported, setHardwareSupported] = useState(false);
  const [hardwareListening, setHardwareListening] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const activePropRef = useRef<any>(null);
  const bodyRef = useRef<Matter.Body | null>(null);
  const sensorRef = useRef<Matter.Body | null>(null);

  // Sync selected proposal ref for the collision listener
  useEffect(() => {
    activePropRef.current = selectedProp;
  }, [selectedProp]);

  // Handle Matter-js physics cleanup
  const cleanupPhysics = useCallback(() => {
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      if (renderRef.current.canvas) {
        const ctx = renderRef.current.canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, renderRef.current.canvas.width, renderRef.current.canvas.height);
      }
      renderRef.current = null;
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    bodyRef.current = null;
    sensorRef.current = null;
  }, []);

  const handlePhysicalCollisionScan = useCallback(() => {
    const prop = activePropRef.current;
    if (!prop) return;

    setNfcScanning(true);
    playFlip();
    setNfcTriggeredText(null);

    // Trigger physical NFC synchronization in NFCEngine
    const nfcEngine = NFCEngine.getInstance();
    const matchedTag = nfcEngine.triggerExternalSync(prop.realm);

    if (matchedTag) {
      setNfcScanning(false);
      playOpen();
      setNfcTriggeredText(
        `NFC Tag ID scan completed! Successfully synchronized physical state. COSMOS is entering [${matchedTag.realm.toUpperCase()}] realm and iOS focus is now [${matchedTag.focusMode}].`
      );
    }
  }, [playFlip, playOpen]);

  // Setup Matter-js simulation
  useEffect(() => {
    if (activeTab !== 'proposal' || !selectedProp || !canvasRef.current) {
      cleanupPhysics();
      return;
    }

    cleanupPhysics();

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 320;
    const height = 240;

    const engine = Matter.Engine.create({
      gravity: { y: 0.15 } // Micro-gravity
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: width,
        height: height,
        background: 'transparent',
        wireframes: false,
        showVelocity: false
      }
    });
    renderRef.current = render;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    const thickness = 50;
    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 5, width * 2, thickness, {
      isStatic: true,
      render: { fillStyle: 'rgba(255, 255, 255, 0.05)' }
    });
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2 + 5, width * 2, thickness, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });
    const leftWall = Matter.Bodies.rectangle(-thickness / 2 + 5, height / 2, thickness, height * 2, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2 - 5, height / 2, thickness, height * 2, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });

    const sensorZone = Matter.Bodies.circle(width / 2, height - 35, 20, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'rgba(16, 185, 129, 0.15)',
        strokeStyle: '#10b981',
        lineWidth: 2
      }
    });
    sensorRef.current = sensorZone;

    const physicalType = selectedProp.metadata.physicalMapping;
    let physicalObject: Matter.Body;

    const startX = width / 2;
    const startY = 40;

    if (physicalType === 'Vinyl') {
      physicalObject = Matter.Bodies.circle(startX, startY, 22, {
        restitution: 0.8,
        friction: 0.02,
        density: 0.001,
        render: {
          fillStyle: '#111111',
          strokeStyle: '#10b981',
          lineWidth: 3
        }
      });
    } else if (physicalType === 'Cassette') {
      physicalObject = Matter.Bodies.rectangle(startX, startY, 48, 30, {
        restitution: 0.5,
        friction: 0.1,
        angle: 0.1,
        render: {
          fillStyle: '#1e293b',
          strokeStyle: '#f97316',
          lineWidth: 2.5
        }
      });
    } else if (physicalType === 'Soul Card') {
      physicalObject = Matter.Bodies.rectangle(startX, startY, 32, 52, {
        restitution: 0.6,
        friction: 0.08,
        angle: -0.15,
        render: {
          fillStyle: '#111827',
          strokeStyle: '#fbbf24',
          lineWidth: 3
        }
      });
    } else {
      physicalObject = Matter.Bodies.polygon(startX, startY, 6, 22, {
        restitution: 0.7,
        friction: 0.05,
        render: {
          fillStyle: '#1e1b4b',
          strokeStyle: '#a855f7',
          lineWidth: 2
        }
      });
    }

    bodyRef.current = physicalObject;

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.Composite.add(engine.world, [
      ground, ceiling, leftWall, rightWall,
      sensorZone, physicalObject,
      mouseConstraint
    ]);

    render.mouse = mouse;

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (
          (pair.bodyA === sensorZone && pair.bodyB === physicalObject) ||
          (pair.bodyB === sensorZone && pair.bodyA === physicalObject)
        ) {
          handlePhysicalCollisionScan();
        }
      }
    });

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      cleanupPhysics();
    };
  }, [activeTab, selectedProp, cleanupPhysics, handlePhysicalCollisionScan]);

  // Load initial data
  const loadData = useCallback(async () => {
    const listInsp = await EntityEngine.list('fusion_inspiration');
    const listProp = await EntityEngine.list('fusion_proposal');
    
    setInspirations(listInsp as any[]);
    setProposals(listProp as any[]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Hardware NFC scanning and listener setup
  useEffect(() => {
    const nfc = NFCEngine.getInstance();
    setHardwareSupported(nfc.isSupported());

    const unsubscribe = nfc.registerListener((tag) => {
      setNfcScanning(false);
      playOpen();
      setNfcTriggeredText(
        `[LIVE REAL-TIME HARDWARE NFC DETECTED] Tag ID: #${tag.id} scanned. Syncing workspace to realm [${tag.realm.toUpperCase()}] with Focus Mode [${tag.focusMode}].`
      );

      // Auto route smoothly to the mapped realm
      const routeTimer = setTimeout(() => {
        window.location.href = tag.path;
      }, 1500);

      return () => clearTimeout(routeTimer);
    });

    return () => {
      unsubscribe();
      nfc.stopScanning();
    };
  }, [playOpen]);

  const toggleHardwareListening = async () => {
    const nfc = NFCEngine.getInstance();
    if (!nfc.isSupported()) {
      setNfcTriggeredText("Error: Web NFC (NDEFReader) is not supported on this device/browser.");
      return;
    }

    try {
      if (hardwareListening) {
        nfc.stopScanning();
        setHardwareListening(false);
        setNfcTriggeredText("Hardware NFC Antenna deactivated.");
      } else {
        setNfcTriggeredText("Activating hardware NDEFReader antenna...");
        await nfc.startScanning();
        setHardwareListening(true);
        setNfcTriggeredText("ACTIVE: Core NDEFReader is listening. Tap physical NFC tag to trigger system.");
      }
    } catch (err: any) {
      setNfcTriggeredText(`Hardware Scan Activation Failed: ${err.message || err}`);
      setHardwareListening(false);
    }
  };

  // Handle adding visual inspiration
  const handleAddInspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspTitle.trim() || !inspDesc.trim()) return;
    playClick();

    const newInsp = {
      type: 'fusion_inspiration' as const,
      title: inspTitle,
      content: inspDesc,
      realm: inspRealm,
      tags: [inspRealm, inspPriority],
      metadata: {
        imageUrl: inspUrl.trim() || undefined,
        notes: inspNotes.trim() || undefined,
        priority: inspPriority,
      },
    };

    const saved = await EntityEngine.create(newInsp);
    setInspirations(prev => [saved as any, ...prev]);

    // Clear form
    setInspTitle('');
    setInspDesc('');
    setInspUrl('');
    setInspNotes('');
    
    // Auto Zoro response
    triggerZoroVerdict(saved.title, saved.content);
  };

  // Ask Zoro (Gemini AI) for his verdict on an inspiration or proposal
  const triggerZoroVerdict = async (title: string, desc: string, context?: string) => {
    setLoadingAdvice(true);
    playFlip();
    const prompt = `You are Roronoa Zoro from One Piece. Speak Thai. Call yourself "ฉัน", call the user "บอส".
Your tone is calm, cold, blunt, deadly serious, with zero fluff. You never say ครับ/ค่ะ.
You are the Technical Vanguard and Chief Architect of the Straw Hat AI Crew. Evaluate this design/feature blueprint for COSMOS:
Title: "${title}"
Description: "${desc}"
${context ? `Extra Technical Context: ${context}` : ''}

Give a sharp, battle-ready code audit and architectural assessment. Tell the boss if this schema rules or is a complete waste of RAM. Keep it to 3 concise, powerful sentences. End with your classic swordsman style catchphrase: "ชักดาบละนะ!"`;

    try {
      const res = await geminiClient.generate(prompt);
      setZoroAdvice(res || 'ฉันไม่มีเวลามาวิเคราะห์ความคิดสวะๆ หรอกนะบอส... (กรุณลองใหม่อีกครั้ง)');
    } catch (err) {
      setZoroAdvice('ชิ! ดาบเริ่มทื่อซะแล้วสิ บอสลองส่งความคิดนี้มาใหม่อีกรอบซิ');
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Convert inspiration to feature proposal (manual drafting in Phase 1 & 2)
  const handlePromoteToProposal = async (insp: Inspiration) => {
    playClick();
    
    // Auto map a physical item type based on realm using a stable time index instead of Math.random
    const physicalItemTypes: Proposal['metadata']['physicalMapping'][] = [
      'Vinyl', 'Cassette', 'Soul Card', 'DNA', 'Memory Card', 'Planet', 'Artifact', 'Crystal', 'Notebook'
    ];
    const pickedPhysical = getStableRandomMapping(physicalItemTypes) as Proposal['metadata']['physicalMapping'];

    const newProposal = {
      type: 'fusion_proposal' as const,
      title: insp.title,
      content: insp.content,
      realm: insp.realm,
      tags: [insp.realm, 'Version 6'],
      metadata: {
        purpose: `เพื่อแก้ไขช่องโหว่และยกระดับโครงสร้างระบบในส่วนอาณาเขต ${insp.realm}`,
        priority: insp.metadata.priority,
        userStory: `ในฐานะผู้ใช้ ฉันต้องการเข้าถึงโมดูล ${insp.title} เพื่อความรวดเร็วในการจัดกลุ่มสติปัญญาความคิดของฉัน`,
        interaction: 'Click, Hover interaction with Spring Physics, NFC physical card swipe',
        automation: `AI Crew triggers when status enters 'Active'. Auto sync to Obsidian /Vault/COSMOS/${insp.realm}.`,
        physicalMapping: pickedPhysical,
        aiCrew: 'Gemini (Technical Planner), Zoro (Security Review), Nami (Resource Allocator)',
        nfc: `ติดตั้งแท็ก NFC ทางกายภาพไว้ที่มุมโต๊ะทำงานสติปัญญา เพื่อกระตุ้น Realm ${insp.realm} ทันทีเมื่อแตะโทรศัพท์`,
        anytype: `Object Type: CosmosFeature, Relations: belongsToRealm (${insp.realm}), Properties: priority, codeBlueprint`,
        obsidian: `Folder: /Vault/COSMOS/Features/\nTemplate: cosmos-feature-blueprint\nTags: #vnext #cosmos/${insp.realm.toLowerCase()}`,
        clickUp: 'Designing' as const,
        databaseFields: JSON.stringify(customFields),
        implementation: 'React 19 with Named Imports, TanStack Start routes, TailwindCSS CSS-variable theme, useSound context.',
        roadmapVersion: 'Version 6' as const,
        verdict: zoroAdvice,
      },
    };

    const saved = await EntityEngine.create(newProposal);
    setProposals(prev => [saved as any, ...prev]);
    selectProposal(saved as any);
    setActiveTab('proposal');
    playOpen();
  };

  const selectProposal = (p: Proposal | null) => {
    setSelectedProp(p);
    if (p && p.metadata.databaseFields) {
      try {
        setCustomFields(JSON.parse(p.metadata.databaseFields));
      } catch (e) {
        // Fallback
      }
    }
  };

  // Update proposals on DB
  const handleUpdateProposalMetadata = async (id: string, updatedFields: Partial<Proposal['metadata']>) => {
    const target = proposals.find(p => p.id === id);
    if (!target) return;
    const updatedMeta = { ...target.metadata, ...updatedFields };
    await EntityEngine.update(id, { metadata: updatedMeta });
    setProposals(prev => prev.map(p => p.id === id ? { ...p, metadata: updatedMeta } : p));
    if (selectedProp?.id === id) {
      setSelectedProp(prev => prev ? { ...prev, metadata: updatedMeta } : null);
    }
  };

  // Change proposal version on roadmap
  const handleUpdateVersion = async (propId: string, newVersion: 'Version 6' | 'Version 7' | 'Version 8' | 'Version 9' | 'Version 10') => {
    playClick();
    const target = proposals.find(p => p.id === propId);
    if (!target) return;

    const updatedMeta = {
      ...target.metadata,
      roadmapVersion: newVersion,
    };

    await EntityEngine.update(propId, {
      metadata: updatedMeta,
      tags: [target.realm, newVersion],
    });

    setProposals(prev =>
      prev.map(p => (p.id === propId ? { ...p, metadata: updatedMeta, tags: [p.realm, newVersion] } : p))
    );
    
    if (selectedProp?.id === propId) {
      setSelectedProp(prev => prev ? { ...prev, metadata: updatedMeta, tags: [prev.realm, newVersion] } : null);
    }
  };

  // Change status of ClickUp simulation
  const handleUpdateClickUpStatus = async (propId: string, newStatus: Proposal['metadata']['clickUp']) => {
    playClick();
    await handleUpdateProposalMetadata(propId, { clickUp: newStatus });
  };

  // Delete items
  const handleDeleteInsp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    await EntityEngine.delete(id);
    setInspirations(prev => prev.filter(i => i.id !== id));
    if (selectedInsp?.id === id) setSelectedInsp(null);
  };

  const handleDeleteProp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    await EntityEngine.delete(id);
    setProposals(prev => prev.filter(p => p.id !== id));
    if (selectedProp?.id === id) setSelectedProp(null);
  };

  // Schema Editor actions
  const handleAddCustomField = () => {
    if (!newFieldName.trim()) return;
    playClick();
    const isPrimary = customFields.length === 0;
    const field: DBField = {
      name: newFieldName.toLowerCase().replace(/\s+/g, '_'),
      type: newFieldType,
      isPrimaryKey: isPrimary,
      isNullable: isPrimary ? false : newFieldNullable,
    };
    const updated = [...customFields, field];
    setCustomFields(updated);
    setNewFieldName('');
    
    if (selectedProp) {
      handleUpdateProposalMetadata(selectedProp.id, { databaseFields: JSON.stringify(updated) });
    }
  };

  const handleRemoveField = (index: number) => {
    playClick();
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
    if (selectedProp) {
      handleUpdateProposalMetadata(selectedProp.id, { databaseFields: JSON.stringify(updated) });
    }
  };

  // Trigger simulated physical NFC scan by applying velocity force to object
  const handleSimulateNfcScan = () => {
    if (!selectedProp) return;
    
    playFlip();
    setNfcTriggeredText(null);
    setNfcScanning(true);

    if (bodyRef.current && canvasRef.current) {
      const body = bodyRef.current;
      const canvas = canvasRef.current;
      const width = canvas.clientWidth || 320;
      const height = 240;

      // Target is the sensor at center bottom
      const targetX = width / 2;
      const targetY = height - 35;

      const dx = targetX - body.position.x;
      const dy = targetY - body.position.y;
      
      // Direct physical impulse vector to guide object to sensor
      Matter.Body.setVelocity(body, {
        x: dx * 0.15,
        y: dy * 0.15
      });
    }

    // Instantly sync state through the real physical NFCEngine
    const nfcEngine = NFCEngine.getInstance();
    const matchedTag = nfcEngine.triggerExternalSync(selectedProp.realm);

    if (matchedTag) {
      setNfcScanning(false);
      playOpen();
      setNfcTriggeredText(
        `NFC PHYSICAL SYNCHRONIZATION ESTABLISHED: Detected NFC Chip mapping to [${matchedTag.realm.toUpperCase()}]. Device focus state sync initiated.`
      );
    }
  };

  // Generate dynamic PostgreSQL SQL string
  const generatedSql = useMemo(() => {
    const tableName = selectedProp 
      ? `cosmos_${selectedProp.title.toLowerCase().replace(/\s+/g, '_')}`
      : 'cosmos_custom_features';
    
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    const lines = customFields.map(f => {
      let line = `  ${f.name} ${f.type}`;
      if (f.isPrimaryKey) line += ' PRIMARY KEY';
      if (!f.isNullable) line += ' NOT NULL';
      return line;
    });
    sql += lines.join(',\n');
    sql += `\n);\n\n-- Indexes & Real-time Subscriptions\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_realm ON ${tableName}(realm);\n`;
    return sql;
  }, [customFields, selectedProp]);

  // Generate markdown output for Obsidian Template
  const generatedObsidianMarkdown = useMemo(() => {
    if (!selectedProp) return '';
    return `---
title: "${selectedProp.title}"
purpose: "${selectedProp.metadata.purpose}"
realm: "${selectedProp.realm}"
priority: "${selectedProp.metadata.priority}"
physical_mapping: "${selectedProp.metadata.physicalMapping}"
created_at: "${new Date(selectedProp.createdAt).toISOString()}"
tags:
  - cosmos-system-proposal
  - realm/${selectedProp.realm.toLowerCase()}
  - roadmap/${selectedProp.metadata.roadmapVersion.toLowerCase().replace(/\s+/g, '')}
---

# 🌌 COSMOS VNext System Proposal: ${selectedProp.title}

## Purpose
${selectedProp.metadata.purpose}

## User Story
${selectedProp.metadata.userStory}

## Anytype Model Mapping
- **Type**: CosmosFeature Object
- **Database Schema Fields**: \`${customFields.map(f => f.name).join(', ')}\`

## Zoro Chief Architect Verdict
> ${selectedProp.metadata.verdict || 'No assessment yet.'}
`;
  }, [selectedProp, customFields]);

  return (
    <div className="min-h-screen text-[var(--aether-text-primary)] font-sans pb-12">
      {/* Dynamic emerald/neon-themed gradient blur backdrop */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main COSMOS Header Section */}
      <header className="relative max-w-7xl mx-auto px-6 pt-10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Icon name="Cpu" size="lg" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-400 tracking-widest uppercase block mb-0.5">COSMOS STUDIO PRO // PHASE 2</span>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">FEATURE & DESIGN FUSION ENGINE</h1>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3 max-w-2xl">
            แปลงภาพแรงบันดาลใจ ดีไซน์ ยีนสติปัญญา ให้เป็นพริ้นต์สคริปต์ โครงสร้าง Database ความสัมพันธ์ Anytype, Obsidian, แผน ClickUp และ NFC ทางกายภาพ
          </p>
        </div>

        {/* Tab Switcher Actions with custom hover/sounds */}
        <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-[var(--theme-surface)] p-1.5 rounded-xl border border-[var(--theme-border)]">
          {(['inspiration', 'proposal', 'roadmap', 'sandbox', 'studio_pro_features'] as const).map(tab => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={tab}
              onClick={() => {
                playClick();
                setActiveTab(tab);
              }}
              onMouseEnter={playHover}
              className={`px-4 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-[var(--theme-primary)] text-white font-extrabold shadow-[0_0_20px_var(--theme-glow)]'
                  : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-glass)]'
              }`}
            >
              {tab === 'inspiration' && '🌌 Inspiration Deck'}
              {tab === 'proposal' && '🛠️ System Proposals'}
              {tab === 'roadmap' && '🗺️ VNext Roadmap'}
              {tab === 'sandbox' && '💻 Schema Sandbox'}
              {tab === 'studio_pro_features' && '🎵 Studio Pro'}
            </motion.button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT ACTIVE WORKSPACE SECTION */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TAB 1: INSPIRATION DECK */}
          {activeTab === 'inspiration' && (
            <div className="space-y-8">
              {/* Form to submit ideas */}
              <Glass border opacity={0.06} className="p-6 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Icon name="PlusCircle" className="text-emerald-400" />
                  บันทึกอินพุตแรงบันดาลใจระบบ (Visual Input / Design Senses)
                </h2>
                
                <form onSubmit={handleAddInspiration} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">ชื่อแรงบันดาลใจ / แนวคิด</label>
                      <input
                        type="text"
                        required
                        value={inspTitle}
                        onChange={(e) => setInspTitle(e.target.value)}
                        placeholder="เช่น Glassmorphism Activity Log หรือ Interactive Vinyl Widget..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Realm ขอบเขต</label>
                      <select
                        value={inspRealm}
                        onChange={(e) => setInspRealm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                      >
                        {['CORE', 'WORK', 'THINK', 'STUDIO', 'LIFE', 'SIGNAL', 'MONEY'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">อธิบายความรู้สึก / ฟังก์ชันการใช้งาน / สิ่งที่ต้องแก้ไข</label>
                    <textarea
                      required
                      value={inspDesc}
                      onChange={(e) => setInspDesc(e.target.value)}
                      placeholder="อธิบายว่าการออกแบบนี้ช่วยแก้ปัญหาอะไรในระบบเดิม หรือสร้างสรรค์สิ่งใหม่ได้อย่างไร..."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">URL ภาพดีไซน์อ้างอิง</label>
                      <input
                        type="url"
                        value={inspUrl}
                        onChange={(e) => setInspUrl(e.target.value)}
                        placeholder="เช่น https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">ระดับความสำคัญระบบ (Priority)</label>
                      <div className="flex gap-1.5">
                        {(['Critical', 'High', 'Medium', 'Low', 'Future'] as const).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { playClick(); setInspPriority(p); }}
                            className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${
                              inspPriority === p
                                ? 'bg-white text-black border-white shadow-lg'
                                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">บันทึกสถาปัตยกรรมย่อย (Notes)</label>
                    <input
                      type="text"
                      value={inspNotes}
                      onChange={(e) => setInspNotes(e.target.value)}
                      placeholder="เช่น ต้องผสานรวมกับโมดูล Dexie DB ในส่วน Offline-first..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                    >
                      <Icon name="Zap" size="sm" /> จารึกสัญชาตญาณไอเดีย
                    </button>
                  </div>
                </form>
              </Glass>

              {/* Inspiration Deck grid list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Icon name="Layers" size="xs" /> แกลเลอรีความรู้สึกและแนวคิดสะสม ({inspirations.length})
                  </h3>
                </div>

                {inspirations.length === 0 ? (
                  <Glass border opacity={0.03} className="p-12 text-center border-white/5 text-gray-500 rounded-2xl">
                    <Icon name="Inbox" className="mx-auto mb-4 opacity-20" size="xl" />
                    <p className="font-semibold text-sm">ยังไม่มีความรู้สึกหรือไอเดียถอดรหัสเก็บไว้ในระบบบอส!</p>
                    <p className="text-xs text-gray-600 mt-1">กรอกข้อมูลการออกแบบที่บอสพึงพอใจด้านบนและกดจารึกได้ทันที</p>
                  </Glass>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inspirations.map(insp => (
                      <Glass
                        key={insp.id}
                        border
                        opacity={0.08}
                        className={`p-5 cursor-pointer border-white/10 hover:border-emerald-500/30 transition-all group ${
                          selectedInsp?.id === insp.id ? 'ring-2 ring-emerald-500/40 border-emerald-500/50' : ''
                        }`}
                        onClick={() => {
                          playOpen();
                          setSelectedInsp(insp);
                          triggerZoroVerdict(insp.title, insp.content);
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2 py-0.5 text-[9px] rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-black uppercase">
                            {insp.realm}
                          </span>
                          <span className={`text-[10px] font-extrabold ${
                            insp.metadata.priority === 'Critical' ? 'text-red-400' :
                            insp.metadata.priority === 'High' ? 'text-orange-400' :
                            'text-gray-400'
                          }`}>
                            {insp.metadata.priority}
                          </span>
                        </div>
                        
                        <h4 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors">{insp.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-3 mb-4">{insp.content}</p>

                        {insp.metadata.imageUrl && (
                          <div className="h-32 w-full rounded-lg overflow-hidden border border-white/5 mb-4 bg-black/40">
                            <img src={insp.metadata.imageUrl} alt={insp.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                          </div>
                        )}

                        {insp.metadata.notes && (
                          <div className="p-2.5 bg-black/30 border border-white/5 rounded-lg text-[10px] text-gray-500 mb-4 italic">
                            💡 {insp.metadata.notes}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3">
                          <span>{new Date(insp.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromoteToProposal(insp);
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-extrabold uppercase flex items-center gap-0.5"
                            >
                              <Icon name="ArrowUpRight" size="xs" /> ยกเป็นสเปกข้อเสนอ
                            </button>
                            <button
                              onClick={(e) => handleDeleteInsp(insp.id, e)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Icon name="Trash" size="xs" />
                            </button>
                          </div>
                        </div>
                      </Glass>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM PROPOSALS WITH RICH INTERACTIVE BLOCKS */}
          {activeTab === 'proposal' && (
            <div className="space-y-6">
              
              {/* ClickUp simulated workflow states bar */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                  📋 ClickUp Workflow Sprint Board
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                  {(['Backlog', 'Designing', 'In-Progress', 'Active'] as const).map(st => {
                    const count = proposals.filter(p => p.metadata.clickUp === st).length;
                    return (
                      <div
                        key={st}
                        className={`py-2 px-1 rounded-lg border transition-all ${
                          st === 'Backlog' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                          st === 'Designing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          st === 'In-Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        }`}
                      >
                        <div className="uppercase tracking-wider">{st}</div>
                        <div className="text-sm font-bold mt-1">{count} items</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proposals list */}
              {proposals.length === 0 ? (
                <Glass border opacity={0.03} className="p-12 text-center border-white/5 text-gray-500 rounded-2xl">
                  <Icon name="Terminal" className="mx-auto mb-4 opacity-20" size="xl" />
                  <p className="font-semibold text-sm">ยังไม่มีพิมพ์เขียวสถาปัตยกรรมที่ประเมินและร่างไว้</p>
                  <p className="text-xs text-gray-600 mt-1">ไปที่แท็บ "Inspiration Deck" แล้วกด "ยกเป็นสเปกข้อเสนอ" เพื่อสถิติกำหนดค่า</p>
                </Glass>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposals.map(prop => (
                    <Glass
                      key={prop.id}
                      border
                      opacity={selectedProp?.id === prop.id ? 0.15 : 0.07}
                      className={`p-5 cursor-pointer border-white/10 hover:border-purple-500/30 transition-all ${
                        selectedProp?.id === prop.id ? 'ring-2 ring-purple-500/50 border-purple-500/60' : ''
                      }`}
                      onClick={() => {
                        playOpen();
                        selectProposal(prop);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-0.5 text-[9px] rounded bg-purple-500/15 text-purple-300 border border-purple-500/35 font-bold uppercase">
                          {prop.realm}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 text-[8px] rounded font-black uppercase ${
                            prop.metadata.clickUp === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            prop.metadata.clickUp === 'In-Progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {prop.metadata.clickUp}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {prop.metadata.roadmapVersion}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-base font-bold text-white mb-2">{prop.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-3 mb-4">{prop.content}</p>

                      <div className="flex justify-between items-center text-[9px] text-gray-500 border-t border-white/5 pt-3">
                        <span className="flex items-center gap-1">
                          📟 Physical Mapping: <strong className="text-purple-400">{prop.metadata.physicalMapping}</strong>
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleDeleteProp(prop.id, e)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Icon name="Trash" size="xs" />
                          </button>
                        </div>
                      </div>
                    </Glass>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VNEXT ROADMAP BOARD */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-3">
                <Icon name="Info" className="flex-shrink-0 text-emerald-400" />
                <span>
                  นี่คือแผนงานจัดลำดับสถาปัตยกรรม <strong>COSMOS VNext (Version 6 - 10)</strong> เลือกข้อเสนอจากบอร์ดเพื่อย้ายกลุ่มเวอร์ชันจัดตารางการเขียนโค้ด!
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {(['Version 6', 'Version 7', 'Version 8', 'Version 9', 'Version 10'] as const).map(version => {
                  const versionProps = proposals.filter(p => p.metadata.roadmapVersion === version);
                  return (
                    <div key={version} className="flex-shrink-0 min-w-[200px] bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col h-[520px]">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                        <span className="text-xs font-black text-white">{version}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                          {versionProps.length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3">
                        {versionProps.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[10px] text-gray-600 italic border border-dashed border-white/5 rounded-lg p-3">
                            Empty Plane
                          </div>
                        ) : (
                          versionProps.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                playOpen();
                                selectProposal(p);
                                setActiveTab('proposal');
                              }}
                              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-lg cursor-pointer transition-all text-left group"
                            >
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[8px] font-black uppercase text-emerald-400">{p.realm}</span>
                                <span className="text-[8px] text-gray-500 font-extrabold">{p.metadata.priority}</span>
                              </div>
                              <h5 className="text-xs font-bold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">{p.title}</h5>
                              
                              <div className="mt-2 flex items-center justify-between text-[8px] text-gray-500 border-t border-white/5 pt-1.5">
                                <span>Tag Scan: {p.metadata.physicalMapping}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SCHEMA SANDBOX PLAYGROUND */}
          {activeTab === 'sandbox' && (
            <div className="space-y-6 text-left">
              <Glass border opacity={0.06} className="p-6 border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="Database" className="text-emerald-400" />
                    Interactive Database & Relational Schema Sandbox
                  </h3>
                  <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-emerald-300 rounded font-black">ACTIVE PLAYGROUND</span>
                </div>

                <p className="text-xs text-gray-400 mb-6">
                  สร้างและปรับแต่งฟิลด์ตารางฐานข้อมูล สัญชาติญาณ SQL, Firestore, Anytype Properties ของคุณ คัดลอก Blueprint ไปปะไว้ในโค้ดระบบทันที
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Database Fields Manager */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase text-gray-400 tracking-wider font-extrabold flex items-center gap-1.5">
                      <Icon name="Sliders" size="xs" /> ตารางฟิลด์สถิติ
                    </h4>
                    
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                      {customFields.map((field, index) => (
                        <div key={index} className="flex justify-between items-center p-2.5 bg-black/40 border border-white/5 rounded-lg text-xs text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 flex items-center justify-center bg-white/5 border border-white/10 rounded text-[9px] text-gray-400 font-bold">{index + 1}</span>
                            <span className="font-mono text-emerald-300">{field.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">({field.type})</span>
                            {field.isPrimaryKey && (
                              <span className="text-[8px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1 rounded font-black">PK</span>
                            )}
                            {!field.isNullable && (
                              <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 rounded font-black">NOT NULL</span>
                            )}
                          </div>
                          {index > 0 && (
                            <button
                              onClick={() => handleRemoveField(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Icon name="X" size="xs" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Field Creation controls */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">เพิ่มฟิลด์ใหม่</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="ชื่อฟิลด์ (เช่น user_id)"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          className="bg-black/50 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                        <select
                          value={newFieldType}
                          onChange={(e) => setNewFieldType(e.target.value as any)}
                          className="bg-black/50 text-white border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                        >
                          {['TEXT', 'INTEGER', 'BOOLEAN', 'UUID', 'TIMESTAMP', 'JSONB'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newFieldNullable}
                            onChange={(e) => setNewFieldNullable(e.target.checked)}
                            className="rounded border-white/10 bg-black"
                          />
                          อนุญาตให้เป็น NULL (Nullable)
                        </label>
                        <button
                          onClick={handleAddCustomField}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-3 py-1 text-[10px] uppercase rounded"
                        >
                          เพิ่มฟิลด์
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Generated SQL Code Block */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs uppercase text-gray-400 tracking-wider font-extrabold flex items-center gap-1.5">
                        <Icon name="Code" size="xs" /> SQL Migration Script
                      </h4>
                      <button
                        onClick={() => {
                          playClick();
                          navigator.clipboard.writeText(generatedSql);
                        }}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold"
                      >
                        <Icon name="Copy" size="xs" /> COPY SCRIPT
                      </button>
                    </div>

                    <pre className="p-3 bg-black/60 border border-white/5 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto h-[220px] leading-relaxed">
                      {generatedSql}
                    </pre>
                  </div>
                </div>
              </Glass>
            </div>
          )}

          {activeTab === 'studio_pro_features' && (
            <div className="space-y-6">
              <Glass border opacity={0.1} className="p-6 border-white/5 relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="border-b border-white/5 pb-4 mb-6">
                  <span className="text-xs font-black text-amber-400 tracking-widest uppercase block mb-1">
                    STUDIO PRO WORKSPACE // PHASE 3
                  </span>
                  <Heading size="32" className="text-white font-extrabold">
                    17 Music Features (Studio Pro)
                  </Heading>
                  <p className="text-xs text-gray-400 mt-1">
                    เครื่องมือดนตรี AI สำหรับคัดลอก ค้นหา และวิเคราะห์ระดับสูง เพื่อตัดแต่งเสียงได้ดั่งใจ
                  </p>
                </div>

                {/* Sub Features grid selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-8">
                  {[
                    { id: 'tuner', label: '🎸 Guitar Tuner', desc: 'ตั้งสายกีต้าร์ความแม่นยำสูง' },
                    { id: 'midi', label: '🎹 MIDI Export', desc: 'ส่งออกรูปแบบเป็นโน้ต MIDI' },
                    { id: 'analyzer', label: '📊 Audio Analyzer', desc: 'วิเคราะห์ BPM/Key/Chords' },
                    { id: 'chords', label: '🎵 Chord Generator', desc: 'ถอดคอร์ดเนื้อเพลงด้วย AI' },
                    { id: 'composer', label: '✨ AI Composer', desc: 'แต่งเพลงเต็มรูปแบบด้วยสัญชาตญาณ' },
                    { id: 'trainer', label: '🎥 Guitar Trainer', desc: 'ฝึกนิ้วกีต้าร์ผ่านกล้องวิดีโอ' }
                  ].map((feat) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={feat.id}
                      onClick={() => {
                        playClick();
                        setActiveSubFeature(feat.id as any);
                        
                        // Update Zoro advice depending on tool selected
                        const adviceMap = {
                          tuner: 'เครื่องตั้งสายแม่นยำระดับดาบโคโตสึ บอสดีดสายกีต้าร์มาเลย ฉันฟังจับคลื่นเสียงความถี่ได้ละเอียดยิบ!',
                          midi: 'แปลงจังหวะดิบให้กลายเป็นสเกล MIDI ทรงพลัง ดั่งคลื่นกระแทก 36 ปอนด์ที่ไร้จุดบกพร่อง!',
                          analyzer: 'อัพโหลดไฟล์เพลงสิวะบอส ฉันจะสับบีต วิเคราะห์คีย์เพลง ถอดเนื้อโครงสร้างยับเยินให้เป็นเศษเล็กเศษน้อย!',
                          chords: 'กรอกชื่อเพลงที่อยากได้คอร์ดสิบอส! คอร์ดพวงเนื้อร้องคู่แท็บ จะสับคอร์ดให้เฉียบคมดั่งวิชาสามดาบ!',
                          composer: 'ให้ฉันประพันธ์เพลงให้รึ? ฉันไม่ได้เชี่ยวชาญเครื่องดนตรี แต่สติปัญญากระบวนท่าระดับ AI Composer จะแต่งเพลงที่บอสต้องทึ่ง!',
                          trainer: 'เปิดกล้องฝึกกีต้าร์สิ! วางนิ้วให้ตรงเฟรต แล้วกล้อง AI ของฉันจะแสกนจับทุกสัมผัส ปัดนิ้วพลาดโดนฟันแน่บอส!'
                        };
                        setZoroAdvice(adviceMap[feat.id as keyof typeof adviceMap]);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all duration-300 ${
                        activeSubFeature === feat.id
                          ? 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)]/40 shadow-[0_0_15px_var(--theme-glow)]'
                          : 'bg-[var(--theme-glass)] text-[var(--theme-text-secondary)] border-[var(--theme-border)] hover:border-[var(--theme-primary)]/20'
                      }`}
                    >
                      <div className="text-xs font-black uppercase mb-1">{feat.label}</div>
                      <div className="text-[10px] opacity-70 leading-snug">{feat.desc}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Sub feature renderer */}
                <div className="border-t border-white/5 pt-6">
                  {activeSubFeature === 'tuner' && <Tuner />}
                  {activeSubFeature === 'midi' && <MIDIExport />}
                  {activeSubFeature === 'analyzer' && <Analyzer />}
                  {activeSubFeature === 'chords' && <ChordGenerator />}
                  {activeSubFeature === 'composer' && <Composer />}
                  {activeSubFeature === 'trainer' && <GuitarTrainer />}
                </div>
              </Glass>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ZORO CHIEF ARCHITECT INTEL & ACTIONABLE SELECTED PROPOSAL DRAWER */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Zoro AI Advisor Box */}
          <Glass border opacity={0.1} className="p-6 border-white/10 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 relative flex-shrink-0 bg-emerald-950/40 flex items-center justify-center">
                <span className="text-2xl">🗡️</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-tight">Roronoa Zoro</h3>
                <span className="text-[9px] text-emerald-400 tracking-wider font-black uppercase block mt-0.5">Chief Technical Vanguard</span>
              </div>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-xs leading-relaxed text-gray-300 relative">
              <div className="absolute top-2 right-2 text-[8px] uppercase font-black text-emerald-500/40">Technical Audit</div>
              {loadingAdvice ? (
                <div className="py-4 flex flex-col items-center justify-center gap-2 text-emerald-400">
                  <Icon name="Loader" className="animate-spin" />
                  <span className="text-[10px] animate-pulse">กำลังประเมินโครงสร้างและฟันไอเดียด้วยดาบ...</span>
                </div>
              ) : (
                <p className="italic font-medium text-gray-200">"{zoroAdvice}"</p>
              )}
            </div>

            {selectedInsp && activeTab === 'inspiration' && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inspiration Focus</span>
                  <button
                    onClick={() => setSelectedInsp(null)}
                    className="text-[10px] text-gray-500 hover:text-white"
                  >
                    Clear Focus
                  </button>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-left text-xs">
                  <h4 className="font-bold text-white mb-1">{selectedInsp.title}</h4>
                  <p className="text-gray-400 line-clamp-3 mb-2">{selectedInsp.content}</p>
                  <button
                    onClick={() => handlePromoteToProposal(selectedInsp)}
                    className="w-full bg-emerald-500 text-black font-extrabold py-1.5 rounded text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-emerald-400 transition-all"
                  >
                    <Icon name="ArrowUpRight" size="xs" /> อัปเกรดเป็นข้อเสนอระบบ
                  </button>
                </div>
              </div>
            )}
          </Glass>

          {/* Interactive Selected Proposal Sidebar drawer (Visible on Proposals/Roadmap tab) */}
          {activeTab === 'proposal' && selectedProp && (
            <div className="hidden lg:block space-y-6 text-left">
              <Glass border opacity={0.12} className="p-6 border-white/10 text-left h-[700px] overflow-y-auto space-y-6">
                
                {/* Title & Close */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-extrabold">
                      {selectedProp.realm}
                    </span>
                    <h3 className="text-xl font-black mt-2 text-white">{selectedProp.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProp(null)}
                    className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon name="X" size="sm" />
                  </button>
                </div>

                {/* Quick actions for Proposal */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      triggerZoroVerdict(selectedProp.title, selectedProp.content, `Custom database fields: ${JSON.stringify(customFields)}`);
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2 rounded text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Icon name="Zap" size="xs" /> ฟันโค้ดสถิติ (Audit)
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      // Update verdict to current zoro advice
                      handleUpdateProposalMetadata(selectedProp.id, { verdict: zoroAdvice });
                    }}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-3 py-2 rounded text-[10px] font-bold"
                    title="Save current Zoro verdict"
                  >
                    บันทึกสเปก
                  </button>
                </div>

                {/* Description & Purpose */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-extrabold tracking-wider mb-1.5">Description</h4>
                    <p className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300 whitespace-pre-wrap">{selectedProp.content}</p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-extrabold tracking-wider mb-1.5">Objective / Purpose</h4>
                    <input
                      type="text"
                      value={selectedProp.metadata.purpose}
                      onChange={(e) => handleUpdateProposalMetadata(selectedProp.id, { purpose: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-extrabold tracking-wider mb-1.5">User Story</h4>
                    <textarea
                      value={selectedProp.metadata.userStory}
                      onChange={(e) => handleUpdateProposalMetadata(selectedProp.id, { userStory: e.target.value })}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* ClickUp Sprint Board Status Mapping */}
                <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">ClickUp Sprint Status</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Backlog', 'Designing', 'In-Progress', 'Active'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateClickUpStatus(selectedProp.id, status)}
                        className={`py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all border ${
                          selectedProp.metadata.clickUp === status
                            ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                            : 'bg-transparent text-gray-400 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated NFC / Physical Item Tag Scanner */}
                <div className="p-4 bg-emerald-950/15 border border-emerald-500/20 rounded-xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-1 right-2 text-[8px] text-emerald-400 font-black">NFC PHYSICAL CHIP</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">📟</span>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase leading-none">Physical Object mapping</span>
                      <strong className="text-xs text-emerald-300">{selectedProp.metadata.physicalMapping} Card Tag</strong>
                    </div>
                  </div>

                  {/* Physical 60FPS Matter-js interactive Canvas container */}
                  <div className="relative w-full h-[240px] bg-black/60 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                    <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                    <div className="absolute top-2 left-2 text-[8px] text-gray-500 font-bold uppercase pointer-events-none">
                      MICRO-GRAVITY ROOM (Drag or Swipe Object to Green Sensor Zone)
                    </div>
                    {/* Glowing active sensor label */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20 pointer-events-none tracking-widest">
                      NFC READER BEAM
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSimulateNfcScan}
                    disabled={nfcScanning}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-[10px] uppercase font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {nfcScanning ? (
                      <>
                        <Icon name="Loader2" className="animate-spin" size="xs" />
                        Scanning Physical tag...
                      </>
                    ) : (
                      <>
                        <Icon name="Zap" size="xs" />
                        Simulate NFC Swipe (Apply Physical Impulse)
                      </>
                    )}
                  </button>

                  {/* Physical Hardware NDEFReader Bridge activation */}
                  <div className="pt-1.5 border-t border-emerald-500/10 flex flex-col gap-2">
                    <button
                      onClick={toggleHardwareListening}
                      className={`w-full py-2.5 rounded-lg text-[10px] uppercase font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        hardwareListening 
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40' 
                          : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40'
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        {hardwareListening && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${hardwareListening ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                      </span>
                      {hardwareListening ? 'Stop Hardware NFC' : 'Activate Real NFC Reader'}
                    </button>
                    <div className="text-[8px] text-gray-500 uppercase font-bold text-center">
                      Web NFC Status: {hardwareSupported ? '✅ SUPPORTED' : '⚠️ UNSUPPORTED (Using Apple Webhook Sync fallback)'}
                    </div>
                  </div>

                  <AnimatePresence>
                    {nfcTriggeredText && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-2.5 bg-black/60 border border-emerald-500/20 rounded text-[10px] text-emerald-300 font-medium italic"
                      >
                        {nfcTriggeredText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Anytype & Obsidian export templates */}
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <h4 className="text-xs uppercase text-gray-500 font-extrabold tracking-wider">Ecosystem Synchronization Maps</h4>
                  
                  <div className="space-y-3">
                    {/* Anytype Object model */}
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[10px] text-yellow-400 uppercase tracking-wider">Anytype Schema properties</span>
                        <button
                          onClick={() => {
                            playClick();
                            navigator.clipboard.writeText(selectedProp.metadata.anytype);
                          }}
                          className="text-[9px] text-yellow-500 hover:text-yellow-400 font-bold uppercase"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-300 font-mono leading-relaxed">{selectedProp.metadata.anytype}</p>
                    </div>

                    {/* Obsidian template metadata */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[10px] text-blue-400 uppercase tracking-wider">Obsidian Frontmatter Note</span>
                        <button
                          onClick={() => {
                            playClick();
                            navigator.clipboard.writeText(generatedObsidianMarkdown);
                          }}
                          className="text-[9px] text-blue-500 hover:text-blue-400 font-bold uppercase"
                        >
                          Copy Template
                        </button>
                      </div>
                      <pre className="text-[10px] text-gray-300 font-mono leading-relaxed overflow-x-auto max-h-[120px] bg-black/30 p-1.5 rounded border border-white/5">
                        {generatedObsidianMarkdown}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Saved Zoro Verdict */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2">Saved Vanguard Verdict</h4>
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs italic font-medium">
                    "{selectedProp.metadata.verdict || 'ยังไม่ได้รับการประเมินจากฉัน บอสกดประเมินเลยซิ!'}"
                  </div>
                </div>

                {/* Plan Versioning & delete */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-500 block mb-1 uppercase font-bold">Roadmap Version Plane</span>
                    <select
                      value={selectedProp.metadata.roadmapVersion}
                      onChange={(e) => handleUpdateVersion(selectedProp.id, e.target.value as any)}
                      className="bg-black/50 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Version 6">Version 6</option>
                      <option value="Version 7">Version 7</option>
                      <option value="Version 8">Version 8</option>
                      <option value="Version 9">Version 9</option>
                      <option value="Version 10">Version 10</option>
                    </select>
                  </div>
                  <button
                    onClick={(e) => {
                      handleDeleteProp(selectedProp.id, e);
                      setSelectedProp(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Icon name="Trash2" size="xs" /> ลบข้อเสนอ
                  </button>
                </div>
              </Glass>
            </div>
          )}
        </div>
        
      </main>

      {/* Full screen modal details for smaller layouts / proposals */}
      {activeTab === 'proposal' && selectedProp && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="w-full max-w-lg h-[80vh]">
            <Glass border opacity={0.12} className="p-6 border-white/10 text-left h-full overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                  {selectedProp.realm}
                </span>
                <button onClick={() => setSelectedProp(null)} className="text-gray-400 hover:text-white">
                  <Icon name="X" size="sm" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedProp.title}</h3>
              <p className="text-xs text-gray-300">{selectedProp.content}</p>
              
              <div className="p-3 bg-black/30 rounded border border-white/5 text-xs space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase">Simulated ClickUp Status</span>
                <span className="text-yellow-400 font-bold">{selectedProp.metadata.clickUp}</span>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded border border-emerald-500/20 text-xs text-emerald-300 italic">
                "{selectedProp.metadata.verdict || 'ยังไม่ได้รับประเมินจากฉัน บอส!'}"
              </div>
            </Glass>
          </div>
        </div>
      )}
    </div>
  );
}
