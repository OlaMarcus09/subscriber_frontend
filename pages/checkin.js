import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { QrCode, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCheckInData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
          setQrCode("NOMAD-884-X9");
          setUser({ username: "Olawale", photo_url: null, subscription: { plan: { name: "FLEX_PRO" } } });
          setLoading(false);
      }, 1000);
    } catch (err) {
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
            <h1 className="text-xl font-mono font-bold text-[var(--text-main)] uppercase tracking-widest mb-2">
                <ShieldCheck className="w-5 h-5 inline-block mr-2 text-[var(--color-accent)]" />
                Security Clearance
            </h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">PRESENT TOKEN AT PHYSICAL CHECKPOINT</p>
        </div>

        <div className="relative w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 shadow-xl">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--color-accent)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-accent)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-accent)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--color-accent)]" />

            <div className="bg-[var(--bg-input)] border border-[var(--border-color)] p-8 flex flex-col items-center relative overflow-hidden">
                
                {!loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50 shadow-[0_0_15px_var(--color-accent)] animate-[scan_3s_ease-in-out_infinite]" />
                )}

                {loading ? (
                    <div className="py-20 text-[var(--color-accent)] font-mono text-xs animate-pulse">
                        &gt; GENERATING_ENCRYPTION...
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] font-mono text-2xl mb-4 shadow-inner">
                            {user?.username?.[0] || 'U'}
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-[var(--text-main)] font-mono font-bold text-lg uppercase">{user?.username}</div>
                            <div className="text-[var(--color-accent)] font-mono text-xs tracking-widest mt-1">
                                {user?.subscription?.plan?.name || 'NO_CLEARANCE'}
                            </div>
                        </div>

                        <div className="w-full bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)] p-6 mb-6 relative">
                            <div className="text-center">
                                <QrCode className="w-32 h-32 text-[var(--text-main)] mx-auto opacity-80" />
                                <div className="mt-4 text-2xl font-mono font-bold text-[var(--text-main)] tracking-[0.2em]">
                                    {qrCode}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={fetchCheckInData}
                            className="flex items-center text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
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
