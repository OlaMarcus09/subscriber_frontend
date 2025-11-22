import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Terminal, ArrowRight, AlertCircle } from 'lucide-react';

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
      // 1. Register
      await axios.post(\`\${API_URL}/api/users/register/\`, {
        email,
        username,
        password,
        password2: password,
      });

      // 2. Auto Login to get Token
      const response = await axios.post(\`\${API_URL}/api/auth/token/\`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      Router.push('/plans');

    } catch (err) {
      console.error(err);
      if (err.response?.data?.email) {
        setError('EMAIL_ALREADY_REGISTERED');
      } else {
        setError('CONNECTION_REFUSED: CHECK CONSOLE');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020408] transition-colors duration-300 bg-grid-pattern">
      <Head>
        <title>New Nomad | Workspace OS</title>
      </Head>

      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 p-8 rounded-sm shadow-xl backdrop-blur-sm">
            <div className="text-center mb-8">
                <div className="inline-block px-2 py-0.5 mb-4 border border-orange-500/50 text-orange-500 text-[10px] font-mono tracking-widest uppercase">
                    New User Protocol
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                Initialize ID
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                  Codename (Username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#050505] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-mono text-sm transition-colors placeholder-slate-400"
                  placeholder="e.g. NEO_01"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                  Comms Channel (Email)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#050505] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-mono text-sm transition-colors placeholder-slate-400"
                  placeholder="nomad@mail.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                  Security Key
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#050505] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-mono text-sm transition-colors placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-mono flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF4500] hover:bg-orange-600 text-white font-mono font-bold py-4 px-4 rounded-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                {loading ? 'PROCESSING...' : ':: CREATE_ID'}
              </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs font-mono text-slate-500">
                Have credentials?{' '}
                <Link href="/" legacyBehavior>
                    <a className="text-[#FF4500] hover:underline decoration-1 underline-offset-4">
                    :: ACCESS_TERMINAL
                    </a>
                </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
