import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@cosmos/core';
import { Glass } from '@/components/aether/Glass';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestBypass = () => {
    // Navigate with a mock user bypass or standard access
    // This provides frictionless entrance for testing
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0E1A] text-white">
      {/* Background aesthetic blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <Glass blur={30} opacity={0.65} border glow className="max-w-md w-full p-8 rounded-3xl relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-5xl block animate-bounce">🌌</span>
          <h2 className="text-2xl font-bold tracking-tight">Access COSMOS OS</h2>
          <p className="text-xs text-white/50">Align your digital coordinates with the mainframe</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-white/40 block">Grid Mail Address</label>
            <input
              type="email"
              required
              placeholder="e.g., core@cosmos.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-white/40 block">Secured Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            {loading ? 'Decrypting...' : 'Initialize Access'}
          </button>
        </form>

        <div className="relative flex py-2 items-center text-xs text-white/20">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 uppercase tracking-widest text-[9px]">Or Enter Safe Space</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={handleGuestBypass}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold tracking-wider uppercase transition-colors"
        >
          Initialize Guest Offline Sync
        </button>

        <p className="text-center text-xs text-white/40">
          First trip to this quadrant?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Establish Signature
          </Link>
        </p>
      </Glass>
    </div>
  );
}
