import React, { useState, useEffect } from 'react';
import api from '../lib/api'; // FIXED: Using global api client with interceptor
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { QrCode, RefreshCw } from 'lucide-react';

export default function CheckInPage() {
  const [code, setCode] = useState('LOADING...');
  const [meta, setMeta] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchActiveToken = async () => {
    setLoading(true);
    try {
        // 1. Fetch user data
        const userRes = await api.get('/api/users/me/');
        setUser(userRes.data);
        
        // 2. FIXED: Requests a genuine, authenticated 6-digit authorization token
        // to pass the IsPartnerUser contract check upon partner validation scans.
        const res = await api.post('/api/spaces/generate-token/');
        if (res.data && res.data.code) {
            setCode(res.data.code);
            setMeta(res.data.meta);
        }
    } catch (err) { 
        console.error("Token System Error:", err.response?.data || err.message);
        // If it's a 403 because they have no active plan, show the descriptive error
        setCode(err.response?.data?.error ? 'NO_PLAN' : 'ERROR'); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { 
    fetchActiveToken(); 
  }, []);

  return (
    <AppLayout activePage="checkin">
      <Head><title>Check-in | Workspace OS</title></Head>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
            <h1 className="text-xl font-mono font-bold text-[var(--text-main)] uppercase tracking-widest mb-2">Security Clearance</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">PRESENT TOKEN AT CHECKPOINT</p>
        </div>
        
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-xl flex flex-col items-center">
             {/* NUMERIC CODE */}
             <div className="text-4xl font-mono font-bold text-[var(--color-accent)] tracking-[0.2em] mb-4 text-center border-b border-[var(--border-color)] pb-4 w-full">
                {code}
             </div>

             {/* QR Placeholder */}
             <div className="w-48 h-48 bg-[var(--bg-input)] flex items-center justify-center mb-6">
                <QrCode className="w-32 h-32 text-[var(--text-main)]" />
             </div>

             <div className="text-center mb-6">
                <div className="text-[var(--text-main)] font-mono font-bold uppercase">{user?.username || user?.email || 'NOMAD'}</div>
                <div className="text-[var(--text-muted)] font-mono text-xs mt-1 uppercase">
                    {meta ? `PLAN: ${meta.plan}` : (user?.plan_name || 'SYNCING...')}
                </div>
                {meta && (
                  <div className="text-[var(--text-muted)] font-mono text-[10px] mt-2 border-t border-dashed border-[var(--border-color)] pt-2">
                    BALANCE: {meta.days_total >= 999 ? 'UNLIMITED' : `${meta.days_total - meta.days_used} DAYS`}
                  </div>
                )}
             </div>
             
             <button 
                onClick={fetchActiveToken} 
                disabled={loading}
                className="flex items-center text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50"
             >
                <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} /> {loading ? 'SYNCING...' : 'REFRESH'}
             </button>
        </div>
      </div>
    </AppLayout>
  );
}
