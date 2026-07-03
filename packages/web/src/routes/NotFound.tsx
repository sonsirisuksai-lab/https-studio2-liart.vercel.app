import React from 'react';
import { Link } from 'react-router-dom';
import { Glass } from '@/components/aether/Glass';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Glass blur={30} opacity={0.6} border glow className="max-w-md w-full p-8 rounded-2xl text-center space-y-6">
        <span className="text-6xl block">🛸</span>
        <h2 className="text-2xl font-bold tracking-tight">Realm Not Found</h2>
        <p className="text-sm text-[var(--theme-textSecondary)] leading-relaxed">
          The coordinate grid you are trying to visit does not exist in this sector of the Cosmos.
        </p>
        <Link
          to="/"
          className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold text-sm text-white hover:opacity-90 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          Return to Nexus Overview
        </Link>
      </Glass>
    </div>
  );
}
