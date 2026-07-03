// src/components/Silence/SilenceWellness.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { Save, Trash2, Heart, Moon, Zap, Smile, Sparkles, Activity } from 'lucide-react';
import { StatCard } from '@/components/ui/cards/StatCard';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


export function LifeWellness() {
  const [logs, setLogs] = useState<Entity[]>([]);
  const [mood, setMood] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [meditation, setMeditation] = useState(10);
  const [energy, setEnergy] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  // Chopper Advice State
  const [chopperAdvice, setChopperAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceTopic, setAdviceTopic] = useState('general');

  const loadLogs = React.useCallback(async () => {
    const data = await EntityEngine.list('life');
    setLogs(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  const saveLog = async () => {
    setSaving(true);
    await EntityEngine.create({
      type: 'health',
      title: `Daily Wellness ${date}`,
      content: `Mood: ${mood}/10, Sleep: ${sleep}h, Meditation: ${meditation}min, Energy: ${energy}/10`,
      realm: 'life',
      tags: ['wellness', date],
      status: 'active',
      metadata: { mood, sleep, meditation, energy, date },
    });
    setSaving(false);
    loadLogs();
  };

  const deleteLog = async (id: string) => {
    await EntityEngine.delete(id);
    loadLogs();
  };

  const getMoodEmoji = (val: number) => {
    if (val <= 2) return '😢';
    if (val <= 4) return '😐';
    if (val <= 6) return '🙂';
    if (val <= 8) return '😊';
    return '🌟';
  };

  const avgMood = logs.length ? (logs.reduce((acc, log) => acc + (log.metadata?.mood || 0), 0) / logs.length).toFixed(1) : '0';
  const avgSleep = logs.length ? (logs.reduce((acc, log) => acc + (log.metadata?.sleep || 0), 0) / logs.length).toFixed(1) : '0';
  const avgEnergy = logs.length ? (logs.reduce((acc, log) => acc + (log.metadata?.energy || 0), 0) / logs.length).toFixed(1) : '0';

  const askChopper = React.useCallback(async (customTopic?: string) => {
    setLoadingAdvice(true);
    const activeTopic = customTopic || adviceTopic;
    const recentSummary = logs.length > 0 
      ? `Recent logs show average mood of ${avgMood}/10, sleep of ${avgSleep} hours, and energy of ${avgEnergy}/10.`
      : "The user hasn't added any daily logs yet.";

    const prompt = `You are Tony Tony Chopper 🦌, the cute, super caring, easily-embarrassed reindeer doctor from One Piece.
The user is visiting your clinic inside their COSMOS workspace.
Topic/Query: "${activeTopic}".
Current metrics: ${recentSummary}.

Please give them a cute, medically helpful, warm prescription or advice. If they praise you or say nice things, respond with your signature blushing/embarrassed denial (e.g., "Calling me a great doctor won't make me happy, you bastard! 🌸 *wiggle wiggle*"). Keep it extremely friendly, short (3 sentences max), and use emojis like 🦌, 🌸, 💊, 🩹, 🩹.`;

    try {
      const res = await geminiClient.generate(prompt);
      setChopperAdvice(res);
    } catch (err) {
      setChopperAdvice(`I'm a doctor, I can handle this! 🦌 Please make sure you rest well and drink some warm sweet tea! That will surely raise your energy level. 🌸`);
    } finally {
      setLoadingAdvice(false);
    }
  }, [adviceTopic, avgMood, avgSleep, avgEnergy, logs.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (logs.length > 0) {
        askChopper('general health review');
      } else {
        setChopperAdvice(`Hi there! 🦌 I'm Tony Tony Chopper, your personal system doctor! Log some wellness details so I can check your pulse, look at your energy levels, and prepare custom advice for you! 🌸🩹`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [logs.length, askChopper]);

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <RealmHeader 
          icon="Heart"
          title="LIFE"
          subtitle="ORGANIC · Wellness Tracker"
          glowColor={config.glowColor}
          className="mb-0"
        />
      </div>

      {/* Doctor Chopper's Clinic Corner */}
      <Glass className="p-6 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5 shadow-[0_0_30px_rgba(236,72,153,0.05)] rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse">
              🦌
            </div>
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider font-mono">Dr. Chopper</span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-500/80 px-2 py-0.5 rounded bg-pink-500/10 uppercase tracking-wider font-mono">Prescription & Advice</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="text-sm text-white/95 italic bg-black/20 p-4 rounded-2xl border border-white/5 relative">
              {loadingAdvice ? (
                <div className="flex items-center gap-2 text-white/50">
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                  <span>Chopper is writing a prescription...</span>
                </div>
              ) : (
                chopperAdvice || "Ask me anything, I'll do my best to help!"
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs text-white/40">Topic:</span>
              <button 
                onClick={() => { setAdviceTopic('energy boost'); askChopper('energy boost'); }}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 text-xs text-white/70 transition-all"
              >
                ⚡ Energy Guide
              </button>
              <button 
                onClick={() => { setAdviceTopic('better sleep'); askChopper('better sleep'); }}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 text-xs text-white/70 transition-all"
              >
                🌙 Insomnia Remedy
              </button>
              <button 
                onClick={() => { setAdviceTopic('compliment'); askChopper('compliment / praise'); }}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 text-xs text-white/70 transition-all"
              >
                💖 Praise Chopper!
              </button>
            </div>
          </div>
        </div>
      </Glass>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Average Mood"
          value={`${avgMood}/10`}
          icon={<Smile className="w-5 h-5 text-orange-400" />}
          className="border-orange-500/20"
        />
        <StatCard
          label="Average Sleep"
          value={`${avgSleep}h`}
          icon={<Moon className="w-5 h-5 text-indigo-400" />}
          className="border-indigo-500/20"
        />
        <StatCard
          label="Average Energy"
          value={`${avgEnergy}/10`}
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          className="border-yellow-500/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Glass className="p-6 md:p-8 border-orange-500/10 bg-white/[0.02] backdrop-blur-2xl">
          <Heading size="48" weight="400" className="text-xl mb-6 text-orange-400/90">Today's Log</Heading>
          <div className="space-y-6">
            <div>
              <Label>Date</Label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] focus:outline-none focus:border-orange-500/30 mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label>Mood</Label>
                <span className="text-lg">{getMoodEmoji(mood)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full accent-orange-500 h-1 mt-1"
              />
              <span className="text-sm text-[var(--aether-text-secondary)]">{mood}/10</span>
            </div>

            <div>
              <Label>Sleep (hours)</Label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(Number(e.target.value))}
                className="w-full accent-orange-500 h-1 mt-1"
              />
              <span className="text-sm text-[var(--aether-text-secondary)]">{sleep}h</span>
            </div>

            <div>
              <Label>Meditation (minutes)</Label>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={meditation}
                onChange={(e) => setMeditation(Number(e.target.value))}
                className="w-full accent-orange-500 h-1 mt-1"
              />
              <span className="text-sm text-[var(--aether-text-secondary)]">{meditation}min</span>
            </div>

            <div>
              <Label>Energy</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-orange-500 h-1 mt-1"
              />
              <span className="text-sm text-[var(--aether-text-secondary)]">{energy}/10</span>
            </div>

            <button
              onClick={saveLog}
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Today'}
            </button>
          </div>
        </Glass>

        <Glass className="p-6 md:p-8 border-orange-500/10 bg-white/[0.02] backdrop-blur-2xl">
          <Heading size="48" weight="400" className="text-xl mb-6">Recent Logs</Heading>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {logs.slice(0, 10).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex justify-between items-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02]"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--aether-text-primary)]">
                    {log.metadata?.date || new Date(log.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-[var(--aether-text-secondary)]">
                    Mood: {log.metadata?.mood || 0}/10 · Sleep: {log.metadata?.sleep || 0}h
                  </div>
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="p-1 rounded hover:bg-red-500/10 transition-all text-[var(--aether-text-tertiary)] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <Body size="16" className="text-[var(--aether-text-tertiary)] text-center py-8">
                No logs yet. Start tracking today!
              </Body>
            )}
          </div>
        </Glass>
      </div>
    </RealmContainer>
  );
}
