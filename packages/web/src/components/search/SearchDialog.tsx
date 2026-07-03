import React, { useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Glass } from '../aether/Glass';
import { realms } from '../../lib/realms';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const {
    query,
    setQuery,
    realmFilter,
    setRealmFilter,
    results,
    loading,
  } = useSearch();

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRealmColor = (realmId: string) => {
    const r = realms.find((r) => r.id === realmId);
    return r?.color || '#a855f7';
  };

  const getRealmIcon = (realmId: string) => {
    const r = realms.find((r) => r.id === realmId);
    return r?.icon || '📦';
  };

  const handleResultClick = (result: any) => {
    onClose();
    // Navigate smoothly to the respective realm routes
    if (result.realm === 'core') {
      navigate('/');
    } else {
      navigate(`/${result.realm}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-black/70 backdrop-blur-md">
      <Glass
        blur={40}
        opacity={0.85}
        border
        glow
        className="max-w-2xl w-full p-6 rounded-3xl space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] border-white/10"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="text-xl">🔍</span>
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Global Sector Search</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xs uppercase font-mono tracking-wider">
            Close (Esc)
          </button>
        </div>

        {/* Input box */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type coordinates, tags, or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-white/20 text-lg"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono animate-pulse">
              Scanning...
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
          <button
            onClick={() => setRealmFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-semibold tracking-wider transition-all whitespace-nowrap ${
              realmFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
            }`}
          >
            All Realms
          </button>
          {realms.map((r) => (
            <button
              key={r.id}
              onClick={() => setRealmFilter(r.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-semibold tracking-wider transition-all whitespace-nowrap border ${
                realmFilter === r.id
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10'
              }`}
              style={{
                borderColor: realmFilter === r.id ? `${r.color}60` : 'transparent',
                color: realmFilter === r.id ? r.color : undefined,
              }}
            >
              <span>{r.icon}</span> <span className="ml-1">{r.name}</span>
            </button>
          ))}
        </div>

        {/* Results layout */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden"
              >
                <div className="flex gap-4 items-center relative z-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                    style={{
                      backgroundColor: `${getRealmColor(result.realm)}10`,
                      borderColor: `${getRealmColor(result.realm)}30`,
                    }}
                  >
                    {getRealmIcon(result.realm)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                      {result.title}
                    </h4>
                    <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{result.content}</p>
                  </div>
                </div>

                <span
                  className="text-[9px] uppercase font-mono px-2 py-1 rounded border tracking-wider shrink-0"
                  style={{
                    color: getRealmColor(result.realm),
                    borderColor: `${getRealmColor(result.realm)}30`,
                    backgroundColor: `${getRealmColor(result.realm)}05`,
                  }}
                >
                  {result.realm}
                </span>
              </div>
            ))
          ) : query ? (
            <div className="text-center py-8 text-white/30 space-y-2">
              <span className="text-3xl block">🛸</span>
              <p className="text-xs font-mono">No sector matching coordinates found.</p>
            </div>
          ) : (
            <div className="text-center py-8 text-white/20 space-y-1">
              <p className="text-xs font-mono">Input scan terms above to query the main database...</p>
              <p className="text-[10px] text-white/30">Or press Escape to leave search mode.</p>
            </div>
          )}
        </div>
      </Glass>
    </div>
  );
}
export default SearchDialog;
