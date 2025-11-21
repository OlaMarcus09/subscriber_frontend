import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { QrCode, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckInData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { Router.push('/'); return; }

      // Simulated fetch
      setTimeout(() => {
          setQrCode("NOMAD-884-X9");
          setUser({ username: "Olawale", photo_url: null, subscription: { plan: { name: "FLEX_PRO" } } });
          setLoading(false);
      }, 1000);

    } catch (err) {
       setError("CONNECTION_FAILED");
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckInData();
  }, []);

  return (
    <AppLayout activePage="checkin">
      <Head><title>Access Token | Workspace OS</title></Head>

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        
        <div className="text-center mb-8">
            <h1 className="text-xl font-mono font-bold text-white uppercase tracking-widest mb-2">
                <ShieldCheck className="w-5 h-5 inline-block mr-2 text-[var(--color-accent)]" />
                Security Clearance
            </h1>
            <p className="text-slate-500 font-mono text-xs">PRESENT TOKEN AT PHYSICAL CHECKPOINT</p>
        </div>

        {/* --- ID BADGE CONTAINER --- */}
        <div className="relative w-full max-w-sm bg-[#0a0f1c] border border-white/10 p-1">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--color-accent)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-accent)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-accent)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--color-accent)]" />

            <div className="bg-[#020408] border border-white/5 p-8 flex flex-col items-center relative overflow-hidden">
                
                {/* Scan Line Animation */}
                {!loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50 shadow-[0_0_15px_rgba(255,69,0,0.5)] animate-[scan_3s_ease-in-out_infinite]" />
                )}

                {loading ? (
                    <div className="py-20 text-[var(--color-accent)] font-mono text-xs animate-pulse">
                        &gt; GENERATING_ENCRYPTION...
                    </div>
                ) : (
                    <>
                        {/* User Photo Placeholder */}
                        <div className="w-20 h-20 bg-surface border border-white/10 rounded-full flex items-center justify-center text-slate-600 font-mono text-2xl mb-4">
                            {user?.username?.[0] || 'U'}
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-white font-mono font-bold text-lg uppercase">{user?.username}</div>
                            <div className="text-[var(--color-accent)] font-mono text-xs tracking-widest mt-1">
                                {user?.subscription?.plan?.name || 'NO_CLEARANCE'}
                            </div>
                        </div>

                        {/* The Code */}
                        <div className="w-full bg-white/5 border border-dashed border-slate-700 p-6 mb-6 relative">
                            <div className="text-center">
                                <QrCode className="w-32 h-32 text-white mx-auto opacity-80" />
                                <div className="mt-4 text-2xl font-mono font-bold text-white tracking-[0.2em] text-glow">
                                    {qrCode}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={fetchCheckInData}
                            className="flex items-center text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-3 h-3 mr-2" />
                            REFRESH_TOKEN
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
