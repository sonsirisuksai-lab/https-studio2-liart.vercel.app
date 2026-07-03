import { useState, useEffect } from 'react';
import { searchAllRealms, SearchResult } from '@cosmos/core';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [realmFilter, setRealmFilter] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Handle Cmd+K or Ctrl+K shortcut to activate the global matrix search dial
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      const timer = setTimeout(() => {
        setResults(prev => prev.length > 0 ? [] : prev);
      }, 0);
      return () => clearTimeout(timer);
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchAllRealms(query, realmFilter);
        setResults(searchResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query, realmFilter]);

  return {
    query,
    setQuery,
    realmFilter,
    setRealmFilter,
    results,
    loading,
    isOpen,
    setIsOpen,
  };
}
