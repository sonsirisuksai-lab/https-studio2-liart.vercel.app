// src/components/Abyss/AbyssNote.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Glass3D } from '@/components/aether/Glass3D';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { Plus, Search, Trash2, Edit2, Save, Sparkles, BookOpen, Heart } from 'lucide-react';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


export function ThinkNote() {
  const [notes, setNotes] = useState<Entity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Entity | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Robin & Luffy counselor state
  const [scholarAdvice, setScholarAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [counselor, setCounselor] = useState<'robin' | 'luffy'>('robin');

  const loadNotes = React.useCallback(async () => {
    const data = await EntityEngine.list('think');
    setNotes(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotes();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadNotes]);

  const askScholar = React.useCallback(async (chosenCounselor: 'robin' | 'luffy', note?: Entity) => {
    setLoadingAdvice(true);
    setCounselor(chosenCounselor);

    const activeNote = note || selectedNote;
    const noteSummary = activeNote 
      ? `Title: "${activeNote.title}". Content: "${activeNote.content?.slice(0, 300) || 'None'}"`
      : "No note is currently selected. The user is browsing their library.";

    const systemRole = chosenCounselor === 'robin'
      ? `You are Nico Robin 📖 from One Piece, the wise, elegant, and dark-humored archaeologist of the Straw Hat crew.
You love ancient history, uncovering secrets, and analyzing texts.
Give the user some highly intelligent, mysterious, or fascinating intellectual commentary on their note idea: ${noteSummary}.
Keep your voice calm, extremely classy, and slightly mysterious, but highly supportive. If no note is selected, prompt them to select one so you can examine its historical records. Keep it to 3 sentences max, and use emojis like 📖, 🪶, 👁️, 🌸.`
      : `You are Monkey D. Luffy 🍖 from One Piece, the loud, courageous, meat-loving Captain who wants to become King of the Pirates!
You love adventure, mysteries, and strong determinations.
Give the user some extremely energetic, positive, and reckless feedback on their note idea: ${noteSummary}.
Tell them to go for it and explore the unknown! If no note is selected, tell them to write down their dream so we can set sail! Keep it to 3 sentences max, and use emojis like 🍖, 👒, ⛵, ⚡.`;

    try {
      const res = await geminiClient.generate(systemRole);
      setScholarAdvice(res);
    } catch (err) {
      if (chosenCounselor === 'robin') {
        setScholarAdvice(`Fascinating... This thought might contain clues to the lost century. Keep writing, it is our path to the truth. 📖🌸`);
      } else {
        setScholarAdvice(`WOW! That sounds like an awesome mystery! 👒 I don't get all the words, but let's go check it out right now! Shishishi! 🍖`);
      }
    } finally {
      setLoadingAdvice(false);
    }
  }, [selectedNote]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes.length > 0) {
        askScholar(counselor, selectedNote || undefined);
      } else {
        setScholarAdvice(`Hello! 📖 I am Nico Robin, the Straw Hat Archaeologist. Save some ideas, studies, or notes in this ABYSS mode so we can decode the mysteries of this cosmos together! 🌸`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedNote, notes.length, counselor, askScholar]);

  const filteredNotes = React.useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [search, notes]);

  const createNote = async () => {
    if (!newTitle.trim()) return;
    const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);
    await EntityEngine.create({
      type: 'note',
      title: newTitle,
      content: newContent,
      realm: 'think',
      tags,
      status: 'active',
      metadata: {},
    });
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowNew(false);
    loadNotes();
  };

  const saveNote = async () => {
    if (!selectedNote) return;
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    await EntityEngine.update(selectedNote.id, {
      title: editTitle,
      content: editContent,
      tags,
    });
    setIsEditing(false);
    loadNotes();
    setSelectedNote(null);
  };

  const deleteNote = async (id: string) => {
    await EntityEngine.delete(id);
    loadNotes();
    setSelectedNote(null);
  };

  const selectNote = (note: Entity) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(false);
  };

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <RealmHeader 
          icon="BookOpen"
          title="THINK"
          subtitle="COSMIC · Knowledge Base"
          glowColor={config.glowColor}
          className="mb-0"
        />
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-5 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center gap-2 text-sm font-semibold shadow-lg shadow-purple-500/5 hover:scale-105"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Robin & Luffy Advisor Corner */}
      <Glass3D 
        glowColor="rgba(139, 92, 246, 0.15)"
        className="p-6 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 shadow-[0_0_30px_rgba(139,92,246,0.05)] rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 relative z-20">
              <button 
                onClick={() => askScholar('robin')}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all cursor-pointer ${
                  counselor === 'robin' 
                    ? 'bg-purple-500/20 border-purple-400 scale-105 shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                    : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                }`}
                title="Consult Archaeologist Robin 📖"
              >
                💜
              </button>
              <button 
                onClick={() => askScholar('luffy')}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all cursor-pointer ${
                  counselor === 'luffy' 
                    ? 'bg-red-500/20 border-red-400 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                    : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                }`}
                title="Consult Captain Luffy 👒"
              >
                🍖
              </button>
            </div>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">
              {counselor === 'robin' ? 'Robin\'s Study' : 'Luffy\'s Deck'}
            </span>
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 uppercase tracking-wider font-mono">
                {counselor === 'robin' ? 'Historical Archeology Review' : 'Captain\'s Bold Reaction'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="text-sm text-white/90 italic bg-black/20 p-4 rounded-2xl border border-white/5 relative">
              {loadingAdvice ? (
                <div className="flex items-center gap-2 text-white/50">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                  <span>Decoding ancient Poneglyph script...</span>
                </div>
              ) : (
                scholarAdvice || "Select a note to receive insightful counsel!"
              )}
            </div>
          </div>
        </div>
      </Glass3D>

      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-purple-500/30"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your idea in Markdown..."
              className="w-full mt-2 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-purple-500/30 min-h-[100px] resize-none"
            />
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags: idea, project, research..."
              className="w-full mt-2 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-purple-500/30 text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={createNote}
                className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-all"
              >
                Create Note
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 rounded-xl border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-tertiary)] hover:bg-[var(--aether-text-tertiary)]/5 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aether-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-purple-500/30"
          />
        </div>
        <span className="text-xs text-[var(--aether-text-tertiary)]">{filteredNotes.length} notes</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
                selectedNote?.id === note.id
                  ? 'border-purple-500/30 bg-purple-500/10'
                  : 'border-white/[0.08] hover:border-purple-500/20 bg-white/[0.04] hover:bg-white/[0.06]'
              }`}
              onClick={() => selectNote(note)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-[var(--aether-text-primary)]">{note.title}</span>
                <span className="text-[10px] text-[var(--aether-text-tertiary)]">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              {note.content && (
                <Body size="15" className="text-[var(--aether-text-secondary)] text-xs line-clamp-2 mt-1">
                  {note.content.slice(0, 100)}...
                </Body>
              )}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {note.tags.map((t) => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="md:col-span-1 lg:col-span-2">
          {selectedNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 md:p-8 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08]"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--aether-bg-primary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] focus:outline-none focus:border-purple-500/30"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[150px] px-4 py-2 rounded-xl bg-[var(--aether-bg-primary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] focus:outline-none focus:border-purple-500/30 resize-none"
                  />
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags: idea, project..."
                    className="w-full px-4 py-2 rounded-xl bg-[var(--aether-bg-primary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-purple-500/30 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveNote}
                      className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-all flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-tertiary)] hover:bg-[var(--aether-text-tertiary)]/5 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      className="px-4 py-2 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <Heading size="48" weight="400" className="text-lg">{selectedNote.title}</Heading>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded hover:bg-[var(--aether-text-tertiary)]/10 transition-all text-[var(--aether-text-tertiary)]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Body size="16" className="mt-2 text-[var(--aether-text-secondary)] whitespace-pre-wrap">
                    {selectedNote.content || 'No content'}
                  </Body>
                  {selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedNote.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-[var(--aether-text-tertiary)]">
                    Created: {new Date(selectedNote.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </RealmContainer>
  );
}
