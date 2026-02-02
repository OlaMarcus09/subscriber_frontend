import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- UPDATED CONFIGURATION ---
  // 1. We prioritize the Vercel Environment Variable.
  // 2. We updated the fallback to the NEW Vercel Backend (not Render).
  // 3. We added a check for 'process' to avoid ReferenceError in client-side only environments.
  const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'https://workspace-africa-backend.vercel.app';

  // Set page title using useEffect since we removed next/head
  useEffect(() => {
    document.title = "Nomad Access | Workspace OS";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. REAL API CALL
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });

      // 2. Save Tokens
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // 3. Redirect to Dashboard
      // Using window.location instead of router.push for compatibility
      window.location.href = '/dashboard';

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response?.status === 401) {
        setError('ACCESS_DENIED: Invalid Credentials');
      } else {
        setError('CONNECTION_ERROR: Server Unreachable');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[var(--bg-main)] transition-colors duration-300 bg-grid-pattern">
      
      {/* Theme Switcher Placeholder - Removed external dependency */}
      {/* <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div> */}

      {/* Header Decoration */}
      <div className="absolute top-0 left-0 w-full p-4 border-b border-[var(--border-color)] flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
        <span>WORKSPACE_AFRICA_OS</span>
        <span>AUTH_MODULE_V2.0</span>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8">
            <div className="text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest mb-2">
                &gt; Initializing Nomad Protocol...
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-main)] font-mono">System Login</h1>
        </div>

        <div className="bg-[var(--bg-surface)] border-l-2 border-l-[var(--color-accent)] border-y border-r border-[var(--border-color)] p-8 shadow-2xl relative">
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Identifier (Email)</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-3 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-[var(--text-muted)]"
                        placeholder="nomad@workspace.africa"
                        required
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Security Key</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-3 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-[var(--text-muted)]"
                        placeholder="••••••••••••"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-transparent border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between px-6 group disabled:opacity-50"
                >
                    <span>{loading ? 'AUTHENTICATING...' : '[ENTER PORTAL]'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <a href="#" className="hover:text-[var(--text-main)]">FORGOT_KEY?</a>
                <a href="/signup" className="hover:text-[var(--text-main)]">
                    CREATE_NEW_ID {'->'}
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}