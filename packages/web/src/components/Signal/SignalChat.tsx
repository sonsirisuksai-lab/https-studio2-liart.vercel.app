// src/components/Signal/SignalChat.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { Send, User, Bell, Trash2 } from 'lucide-react';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


export function SignalChat() {
  const [messages, setMessages] = useState<Entity[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Diana']);
  const [selectedContact, setSelectedContact] = useState('Alice');

  const loadMessages = React.useCallback(async () => {
    const data = await EntityEngine.list('signal');
    const filtered = data.filter(m => m.metadata?.contact === selectedContact);
    setMessages(filtered);
  }, [selectedContact]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMessages();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const userText = newMessage;
    await EntityEngine.create({
      type: 'message',
      title: `Chat with ${selectedContact}`,
      content: userText,
      realm: 'signal',
      tags: ['chat', selectedContact],
      status: 'active',
      metadata: { contact: selectedContact, direction: 'outgoing' },
    });
    setNewMessage('');
    await loadMessages();

    // Simulated/Real AI response from Contact
    setTimeout(async () => {
      let reply = '';
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey && apiKey !== 'mock') {
          const sys = `You are ${selectedContact}, a contact on the user's COSMOS personal system. Respond to the user's text message in a friendly, conversational, short text format (1-3 sentences max). User said: "${userText}"`;
          reply = await geminiClient.generate(sys);
        }
      } catch (err) {
        console.error('Contact AI response failed, using fallback:', err);
      }

      if (!reply) {
        if (selectedContact === 'Alice') {
          reply = `Oh wow! That sounds super cool! 😊 Let's catch up and talk more about it later tonight!`;
        } else if (selectedContact === 'Bob') {
          reply = `Understood. I'll take a look at the code and test those components. Let me know if you run into any other bugs! 👍`;
        } else if (selectedContact === 'Charlie') {
          reply = `That's quite a thoughtful point. It really shows how everything is connected when you look at it step-by-step.`;
        } else {
          reply = `I absolutely love that idea! 🎨 The aesthetic of it is so elegant. Let's definitely build that design!`;
        }
      }

      await EntityEngine.create({
        type: 'message',
        title: `Chat with ${selectedContact}`,
        content: reply,
        realm: 'signal',
        tags: ['chat', selectedContact],
        status: 'active',
        metadata: { contact: selectedContact, direction: 'incoming' },
      });
      loadMessages();
    }, 1000);
  };

  const deleteMessage = async (id: string) => {
    await EntityEngine.delete(id);
    loadMessages();
  };

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <RealmHeader 
          icon="MessageCircle"
          title="SIGNAL"
          subtitle="GLASS · Communication Hub"
          glowColor={config.glowColor}
          className="mb-0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <Glass className="p-6 border-cyan-500/10 lg:col-span-1 bg-white/[0.02] backdrop-blur-2xl">
          <Heading size="48" weight="400" className="text-xl mb-6">Contacts</Heading>
          <div className="space-y-2">
            {contacts.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedContact(c)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3 hover:scale-[1.02] ${
                  selectedContact === c
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'hover:bg-white/[0.04] text-[var(--aether-text-secondary)] hover:text-[var(--aether-text-primary)] border border-transparent'
                }`}
              >
                <User className="w-5 h-5" /> {c}
              </button>
            ))}
          </div>
        </Glass>

        <Glass className="p-6 md:p-8 border-cyan-500/10 lg:col-span-3 flex flex-col h-[600px] bg-white/[0.02] backdrop-blur-2xl">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <Heading size="48" weight="400" className="text-2xl">{selectedContact}</Heading>
                <div className="flex items-center gap-2 mt-1 text-sm text-[var(--aether-text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </div>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-all text-[var(--aether-text-secondary)] hover:text-white border border-white/[0.04]">
              <Bell className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.metadata?.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.metadata?.direction === 'outgoing' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl ${
                      msg.metadata?.direction === 'outgoing'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 rounded-br-sm'
                        : 'bg-white/[0.04] border border-white/[0.08] text-[var(--aether-text-primary)] rounded-bl-sm'
                    }`}
                  >
                    <Body size="16" className="leading-relaxed">{msg.content}</Body>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-1 rounded-full opacity-0 hover:opacity-100 hover:bg-red-500/20 transition-all text-[var(--aether-text-tertiary)] hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="text-[10px] text-[var(--aether-text-tertiary)]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[var(--aether-text-tertiary)] opacity-50">
                <Send className="w-12 h-12 mb-4" />
                <Body size="16">No messages yet. Say hello!</Body>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-white/[0.08]">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-cyan-500/30 transition-all text-base"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
            >
              <Send className="w-5 h-5" /> <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </Glass>
      </div>
    </RealmContainer>
  );
}
