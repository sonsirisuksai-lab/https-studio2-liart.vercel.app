// src/components/Life/LifeFinance.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from '@/components/aether/Glass';
import { Heading, Body, Label } from '@/components/aether/Typography';
import { EntityEngine } from '@/lib/entity-engine';
import { Entity } from '@/lib/db';
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, Sparkles } from 'lucide-react';
import { geminiClient } from '@/lib/ai/gemini';
import { RealmContainer } from '@/components/cosmos/RealmContainer';
import { RealmHeader } from '@/components/cosmos/RealmHeader';
import { useRealm } from '@/lib/RealmContext';


export function LifeFinance() {
  const [transactions, setTransactions] = useState<Entity[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  // Advisor Advisor State
  const [financialAdvice, setFinancialAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advisor, setAdvisor] = useState<'nami' | 'jinbe'>('nami');

  const categories = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Salary', 'Investment', 'Other'];

  const loadTransactions = React.useCallback(async () => {
    const data = await EntityEngine.list('life');
    setTransactions(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadTransactions]);

  const addTransaction = async () => {
    if (!amount || !description) return;
    setSaving(true);
    await EntityEngine.create({
      type: 'expense',
      title: description,
      content: `${type}: ${amount}`,
      realm: 'life',
      tags: ['finance', type, category],
      status: 'active',
      metadata: { amount: Number(amount), type, category, date },
    });
    setAmount('');
    setDescription('');
    setCategory('');
    setSaving(false);
    loadTransactions();
  };

  const deleteTransaction = async (id: string) => {
    await EntityEngine.delete(id);
    loadTransactions();
  };

  const totalIncome = transactions
    .filter(t => t.metadata?.type === 'income')
    .reduce((sum, t) => sum + (t.metadata?.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.metadata?.type === 'expense')
    .reduce((sum, t) => sum + (t.metadata?.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const askAdvisor = React.useCallback(async (chosenAdvisor: 'nami' | 'jinbe') => {
    setLoadingAdvice(true);
    setAdvisor(chosenAdvisor);
    
    const statsSummary = `Current balance: ${balance} THB (Total Income is ${totalIncome} THB, Total Expense is ${totalExpense} THB).`;
    
    const systemRole = chosenAdvisor === 'nami'
      ? `You are Nami 💰 from One Piece, the clever, money-loving navigator of the Straw Hat crew.
You absolutely adore gold, belly (money), and shopping, but you are also the level-headed brain of the ship.
Give the user some clever, fun, or sassy financial navigating advice on their current balance status: ${statsSummary}.
If they have a negative balance or high expenses, scold them playfully! If positive, congratulate them but remind them to save up for our travels. Keep it to 3 sentences max, and use emojis like 🍊, 💰, 🗺️.`
      : `You are Jinbe 🌊 from One Piece, the wise, steady, and noble fishman knight of the sea.
You value patient strategies, tactical planning, and calm navigation through rough waters.
Give the user some wise, reassuring, and tactical advice on their budget: ${statsSummary}.
Speak in a calm, warrior-monk, encouraging, and respectful voice. Keep it to 3 sentences max, and use emojis like 🌊, 🥋, 🗺️.`;

    try {
      const res = await geminiClient.generate(systemRole);
      setFinancialAdvice(res);
    } catch (err) {
      if (chosenAdvisor === 'nami') {
        setFinancialAdvice(`Hey! Watch your wallet! 💰 We need millions of Berries for our next grand voyage, so don't throw away gold! 🍊`);
      } else {
        setFinancialAdvice(`Steady your resolve. 🌊 To build a great legacy, we must navigate our expenses like calm waters. Strategy is the pillar of wealth.`);
      }
    } finally {
      setLoadingAdvice(false);
    }
  }, [balance, totalIncome, totalExpense]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (transactions.length > 0) {
        askAdvisor(advisor);
      } else {
        setFinancialAdvice(`Hello! 🪙 I am Nami, the Straw Hat Navigator! Add your income or expense logs so I can help you draw a map of your treasures, and ensure we don't run out of gold! 🍊💰`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [transactions.length, advisor, askAdvisor]);

  const { realm, realmId } = useRealm();
  const config = realm.config3D;

  return (
    <RealmContainer realmId={realmId}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <RealmHeader 
          icon="Wallet"
          title="MONEY"
          subtitle="TACTICAL · Resource Flow"
          glowColor={config.glowColor}
          className="mb-0"
        />
      </div>

      {/* Nami & Jinbe Financial Corner */}
      <Glass className="p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 shadow-[0_0_30px_rgba(59,130,246,0.05)] rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => askAdvisor('nami')}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all ${
                  advisor === 'nami' 
                    ? 'bg-orange-500/20 border-orange-400 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                    : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                }`}
                title="Consult Navigator Nami 💰"
              >
                🍊
              </button>
              <button 
                onClick={() => askAdvisor('jinbe')}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all ${
                  advisor === 'jinbe' 
                    ? 'bg-blue-500/20 border-blue-400 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                    : 'bg-white/5 border-white/10 opacity-40 hover:opacity-80'
                }`}
                title="Consult Tactician Jinbe 🌊"
              >
                🌊
              </button>
            </div>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">
              {advisor === 'nami' ? 'Nami\'s Treasury' : 'Jinbe\'s Counsel'}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 uppercase tracking-wider font-mono">
                {advisor === 'nami' ? 'Navigator Assessment' : 'Helmsman Insight'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm text-white/90 italic bg-black/20 p-4 rounded-2xl border border-white/5 relative">
              {loadingAdvice ? (
                <div className="flex items-center gap-2 text-white/50">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span>Calculating asset distribution maps...</span>
                </div>
              ) : (
                financialAdvice || "Add some logs to trigger financial advice!"
              )}
            </div>
          </div>
        </div>
      </Glass>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Glass className="p-6 border-blue-500/10">
          <div className="flex items-center justify-between">
            <Label>Balance</Label>
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <Heading size="48" weight="400" className={`text-2xl mt-2 ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)} THB
          </Heading>
        </Glass>

        <Glass className="p-6 border-blue-500/10">
          <div className="flex items-center justify-between">
            <Label>Income</Label>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <Heading size="48" weight="400" className="text-2xl mt-2 text-green-400">
            +{totalIncome.toFixed(2)} THB
          </Heading>
        </Glass>

        <Glass className="p-6 border-blue-500/10">
          <div className="flex items-center justify-between">
            <Label>Expenses</Label>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <Heading size="48" weight="400" className="text-2xl mt-2 text-red-400">
            -{totalExpense.toFixed(2)} THB
          </Heading>
        </Glass>
      </div>

      <Glass className="p-6 border-blue-500/10">
        <Heading size="48" weight="400" className="text-base mb-4">Add Transaction</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  type === 'income'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-[var(--aether-bg-secondary)] text-[var(--aether-text-tertiary)] border border-transparent'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-[var(--aether-bg-secondary)] text-[var(--aether-text-tertiary)] border border-transparent'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] focus:outline-none focus:border-blue-500/30"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Amount (THB)</Label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-blue-500/30"
            />
          </div>

          <div>
            <Label>Description</Label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              className="w-full mt-1 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] placeholder:text-[var(--aether-text-tertiary)] focus:outline-none focus:border-blue-500/30"
            />
          </div>

          <div>
            <Label>Date</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10 text-[var(--aether-text-primary)] focus:outline-none focus:border-blue-500/30"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addTransaction}
              disabled={saving || !amount || !description}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> {saving ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </Glass>

      <Glass className="p-6 border-blue-500/10">
        <Heading size="48" weight="400" className="text-base mb-4">Recent Transactions</Heading>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {transactions.slice(0, 20).map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center p-3 rounded-xl bg-[var(--aether-bg-secondary)] border border-[var(--aether-text-tertiary)]/10"
            >
              <div>
                <div className="text-sm font-medium text-[var(--aether-text-primary)]">{t.title}</div>
                <div className="text-xs text-[var(--aether-text-secondary)]">
                  {t.metadata?.category || 'Uncategorized'} · {t.metadata?.date || new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono ${t.metadata?.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.metadata?.type === 'income' ? '+' : '-'}{t.metadata?.amount?.toFixed(2) || 0} THB
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="p-1 rounded hover:bg-red-500/10 transition-all text-[var(--aether-text-tertiary)] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <Body size="16" className="text-[var(--aether-text-tertiary)] text-center py-8">
              No transactions yet. Start tracking!
            </Body>
          )}
        </div>
      </Glass>
    </RealmContainer>
  );
}
