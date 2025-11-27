import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { QrCode, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState('LOADING...');
  const [user, setUser] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  const fetchToken = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${API_URL}/api/users/me/`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        
        // Get or generate token
        // If backend doesn't have a dedicated token endpoint yet, use ID as fallback for MVP
        const code = res.data.id ? res.data.id.toString().padStart(6, '0') : 'ERR-00';
        setQrCode(code);
    } catch (err) { console.error(err); setQrCode('ERROR'); }
  };

  useEffect(() => { fetchToken(); }, []);

  return (
    <AppLayout activePage="checkin">
      <Head><title>Check-in | Workspace OS</title></Head>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
            <h1 className="text-xl font-mono font-bold text-[var(--text-main)] uppercase tracking-widest mb-2">Security Clearance</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">PRESENT TOKEN AT CHECKPOINT</p>
        </div>
        
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-xl flex flex-col items-center">
             {/* NUMERIC CODE (Requested Feature) */}
             <div className="text-4xl font-mono font-bold text-[var(--color-accent)] tracking-[0.2em] mb-4 text-center border-b border-[var(--border-color)] pb-4 w-full">
                {qrCode}
             </div>

             {/* QR Placeholder */}
             <div className="w-48 h-48 bg-[var(--bg-input)] flex items-center justify-center mb-6">
                <QrCode className="w-32 h-32 text-[var(--text-main)]" />
             </div>

             <div className="text-center mb-6">
                <div className="text-[var(--text-main)] font-mono font-bold uppercase">{user?.username}</div>
                <div className="text-[var(--text-muted)] font-mono text-xs mt-1">{user?.subscription?.plan?.name || 'NO_PLAN'}</div>
             </div>
             
             <button onClick={fetchToken} className="flex items-center text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <RefreshCw className="w-3 h-3 mr-2" /> REFRESH
             </button>
        </div>
      </div>
    </AppLayout>
  );
}
