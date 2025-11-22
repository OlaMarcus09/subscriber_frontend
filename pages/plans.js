import React, { useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { CreditCard, Check, Zap, QrCode } from 'lucide-react';

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('subs'); // 'subs' or 'daypass'

  return (
    <AppLayout activePage="plans">
      <Head><title>Access Protocols | Workspace OS</title></Head>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase mb-2">Select Access Protocol</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">CHOOSE YOUR BANDWIDTH</p>
      </div>

      {/* --- TOGGLE TABS --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-sm flex space-x-1">
            <button 
                onClick={() => setActiveTab('subs')}
                className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'subs' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
                Monthly Subs
            </button>
            <button 
                onClick={() => setActiveTab('daypass')}
                className={`px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'daypass' ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
                Day Pass
            </button>
        </div>
      </div>

      {/* --- SUBSCRIPTIONS TAB --- */}
      {activeTab === 'subs' && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* FLEX BASIC */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 hover:border-[var(--text-muted)] transition-colors relative group rounded-sm shadow-sm">
                <div className="text-[var(--text-muted)] font-mono text-xs uppercase mb-4 tracking-widest">FLEX_BASIC</div>
                <div className="mb-6">
                    <span className="text-3xl font-bold text-[var(--text-main)]">₦27,000</span>
                    <span className="text-[var(--text-muted)] font-mono text-xs">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-[var(--text-muted)] font-mono">
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 8 Days Access</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Standard Spaces</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Community WiFi</li>
                </ul>
                <button className="w-full py-3 border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs font-bold hover:border-[var(--text-main)] hover:text-[var(--text-main)] transition-all uppercase">
                    ACTIVATE_BASIC
                </button>
            </div>

            {/* FLEX PRO */}
            <div className="bg-[var(--bg-surface)] border-t-2 border-t-[var(--color-accent)] border-x border-b border-[var(--border-color)] p-6 relative shadow-lg rounded-sm">
                <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[9px] font-mono font-bold px-2 py-1 uppercase">Recommended</div>
                <div className="text-[var(--color-accent)] font-mono text-xs uppercase mb-4 tracking-widest">FLEX_PRO</div>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-[var(--text-main)]">₦55,000</span>
                    <span className="text-[var(--text-muted)] font-mono text-xs">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-[var(--text-main)] font-mono">
                    <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-[var(--color-accent)]" /> 16 Days Access</li>
                    <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-[var(--color-accent)]" /> Standard + Premium</li>
                    <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-[var(--color-accent)]" /> Meeting Room Credits</li>
                </ul>
                <button className="w-full py-3 bg-[var(--color-accent)] text-white font-mono text-xs font-bold hover:opacity-90 transition-all uppercase shadow-lg shadow-orange-500/20">
                    ACTIVATE_PRO
                </button>
            </div>
        </div>
      )}

      {/* --- DAY PASS TAB --- */}
      {activeTab === 'daypass' && (
        <div className="max-w-md mx-auto">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 text-center relative overflow-hidden rounded-sm shadow-md">
                {/* Decorative Scanline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)] animate-pulse"></div>
                
                <div className="w-16 h-16 bg-[var(--bg-input)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-accent)]">
                    <QrCode className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold text-[var(--text-main)] font-mono mb-2">Single Day Pass</h2>
                <p className="text-[var(--text-muted)] text-sm mb-6">
                    Instant access to any Standard or Premium space for 24 hours. Pay now, scan immediately.
                </p>

                <div className="mb-8 p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-sm">
                    <div className="text-3xl font-bold text-[var(--text-main)] font-mono">₦4,500</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">FLAT RATE / DAY</div>
                </div>

                <div className="space-y-3 mb-8 text-left text-sm text-[var(--text-muted)] font-mono">
                    <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                        <span>Valid For:</span>
                        <span className="text-[var(--text-main)]">One Check-in</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                        <span>Expiry:</span>
                        <span className="text-[var(--text-main)]">24 Hours from purchase</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Access:</span>
                        <span className="text-[var(--text-main)]">All 7 Hubs*</span>
                    </div>
                </div>

                <button className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-surface)] font-mono text-xs font-bold uppercase hover:opacity-90 transition-all flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" /> PURCHASE_PASS
                </button>
            </div>
            
            <p className="text-center text-[10px] text-[var(--text-muted)] font-mono mt-4">
                *NOTE: The Bunker requires an additional top-up at the venue.
            </p>
        </div>
      )}

    </AppLayout>
  );
}
