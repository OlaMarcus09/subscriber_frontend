import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API success for design demo if env is missing
      if (!API_URL) {
          setTimeout(() => Router.push('/plans'), 1500);
          return;
      }

      await axios.post(`${API_URL}/api/users/register/`, {
        email,
        username,
        password,
        password2: password,
      });

      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      Router.push('/plans');

    } catch (err) {
      if (err.response?.data?.email) {
        setError('EMAIL_ALREADY_REGISTERED_IN_GRID');
      } else {
        setError('SYSTEM_ERROR: PLEASE_RETRY');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-slate-300 relative overflow-hidden">
      <Head>
        <title>New Nomad | Workspace Africa</title>
      </Head>

      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-sm p-8 relative z-10 bg-surface/80 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
            <div className="inline-block px-2 py-0.5 mb-4 border border-primary/50 text-primary text-[10px] font-mono tracking-widest uppercase">
                New User Protocol
            </div>
            <h1 className="text-2xl font-bold text-white font-mono">
            Initialize ID
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase mb-1">
              Codename (Username)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-slate-700 text-white px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm transition-all"
              placeholder="e.g. NEO_01"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase mb-1">
              Comms Channel (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-slate-700 text-white px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm transition-all"
              placeholder="nomad@mail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase mb-1">
              Security Key
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-slate-700 text-white px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono text-center">
              ⚠ ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-mono font-bold py-3 px-4 rounded-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'PROCESSING...' : ':: CREATE_ID'}
          </button>
        </form>

        <p className="mt-8 text-xs text-center font-mono text-slate-500">
          Have credentials?{' '}
          <Link href="/" legacyBehavior>
            <a className="text-primary hover:underline decoration-1 underline-offset-4">
              :: ACCESS_TERMINAL
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
}
