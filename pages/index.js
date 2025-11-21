import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Terminal, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/plans');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>Nomad Access | Workspace Africa</title>
      </Head>

      {/* --- OS HEADER DECORATION --- */}
      <div className="absolute top-0 left-0 w-full p-4 border-b border-white/5 flex justify-between text-[10px] font-mono text-slate-600">
        <span>WORKSPACE_AFRICA_OS</span>
        <span>AUTH_MODULE_V1.0</span>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Terminal Header */}
        <div className="mb-8">
            <div className="text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest mb-2">
                &gt; Initializing Nomad Protocol...
            </div>
            <h1 className="text-3xl font-bold text-white">System Login</h1>
        </div>

        {/* Login Card */}
        <div className="bg-[#0a0f1c] border-l-2 border-l-[var(--color-accent)] border-y border-r border-white/10 p-8 shadow-2xl relative">
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Identifier (Email)</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#050505] border border-slate-800 text-white px-4 py-3 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        placeholder="nomad@workspace.africa"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Security Key</label>
                    <input 
                        type="password" 
                        className="w-full bg-[#050505] border border-slate-800 text-white px-4 py-3 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        placeholder="••••••••••••"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-transparent border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between px-6 group"
                >
                    <span>{loading ? 'AUTHENTICATING...' : '[ENTER PORTAL]'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-[10px] font-mono text-slate-500">
                <Link href="#" className="hover:text-white">FORGOT_KEY?</Link>
                <Link href="/signup" legacyBehavior>
                    <a className="hover:text-white">CREATE_NEW_ID {'->'}</a>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
